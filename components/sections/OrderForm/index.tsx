import React, { useEffect, useMemo, useState } from "react";
import { useForm, Controller, Control, useWatch } from "react-hook-form";
import { motion } from "framer-motion";
import { FaShoppingCart, FaCreditCard, FaTimes } from "react-icons/fa";
import { CheckboxGroup, QuantitySelector } from "@/components/ui";
import { formatToIDR } from "@/utils/formatCurrency";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Image from "next/image";
import { API_URL } from "@/services";
import { fetcher } from "@/swr/fetcher";

interface FormData {
  type: string;
  size: string;
  iceCube: string;
  sweet: string;
  note: string;
  spicyLevel: string;
  addOns: string;
}

interface ModalHeaderProps {
  onClose: () => void;
}

interface NoteInputProps {
  control: Control<FormData>;
}

interface ActionButtonsProps {
  onSubmit: () => void;
  onAddToCart: () => void;
}

interface OrderFormProps {
  onClose: () => void;
  productDetail: any;
  isOpen: boolean;
}

interface ProductCardProps {
  price: number;
  title: string;
  description?: string;
  image: string;
  onAddToCart?: () => void;
}

// Animation variants
const modalVariants = {
  hidden: {
    y: "100%",
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 500,
      duration: 0.3,
    },
  },
  exit: {
    y: "100%",
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

// Modal Header Component
const ModalHeader: React.FC<ModalHeaderProps> = ({ onClose }) => (
  <div className="sticky top-0 bg-white rounded-t-2xl border-b px-6 py-4 flex items-center justify-between">
    <motion.div
      className="w-12 h-1 bg-gray-300 rounded-full mx-auto"
      initial={{ width: 0 }}
      animate={{ width: 48 }}
      transition={{ delay: 0.2 }}
    />
    <motion.button
      onClick={onClose}
      className="absolute right-4 text-gray-500 hover:text-gray-700 p-2"
      whileHover={{ scale: 1.1, rotate: 90 }}
      whileTap={{ scale: 0.9 }}
    >
      <FaTimes />
    </motion.button>
  </div>
);

// Product Info Component
const ProductInfo: React.FC<ProductCardProps> = ({ title, image, price, description }) => {
  const [img, setImg] = useState(image);

  return (
    <motion.div
      className="flex items-center gap-4 mb-6"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="relative w-16 h-16 flex-shrink-0">
        <Image
          src={img}
          alt={title}
          fill
          sizes="(max-width: 64px) 100vw, 64px"
          className="rounded-lg object-cover"
          onError={() => setImg("/images/product-image.webp")}
          unoptimized={!img.startsWith("/")}
        />
      </div>
      <div>
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-sm font-normal">{description}</p>
        <p className="text-gray-600">{formatToIDR(price)}</p>
      </div>
    </motion.div>
  );
};

// Note Input Component
const NoteInput: React.FC<NoteInputProps> = ({ control }) => (
  <motion.div
    className="mb-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
  >
    <h3 className="text-neutral-500 font-medium mb-3 text-sm">Add Note</h3>
    <Controller
      name="note"
      control={control}
      render={({ field }) => (
        <motion.textarea
          {...field}
          placeholder="Tambahkan note"
          className="w-full p-3 border border-neutral-200 rounded-lg bg-neutral-50 resize-none h-20 text-sm"
          transition={{ type: "spring" }}
        />
      )}
    />
  </motion.div>
);

// Action Buttons Component
const ActionButtons: React.FC<ActionButtonsProps> = ({ onSubmit, onAddToCart }) => (
  <motion.div
    className="flex gap-3 w-full"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 }}
  >
    <motion.button
      type="button"
      onClick={onAddToCart}
      className="w-12 h-12 bg-primary-500 text-white rounded-lg flex items-center justify-center hover:bg-teal-800"
      whileHover={{ scale: 1.05, rotate: 5 }}
      whileTap={{ scale: 0.95 }}
    >
      <FaShoppingCart size={16} />
    </motion.button>
    <motion.button
      type="button"
      onClick={onSubmit}
      className="flex-1 bg-primary-500 hover:bg-teal-800 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-base"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <FaCreditCard />
      Payment Now
    </motion.button>
  </motion.div>
);

// Order Form Component
const OrderForm: React.FC<OrderFormProps> = ({ onClose, productDetail, isOpen = false }) => {
  const router = useRouter();
  const [quantity, setQuantity] = useState<number>(1);
  const [option, setOption] = useState<any>([]);

  const { sweetOptions, iceCubeOptions, sizeOptions, typeOptions, addOnsOptions, spicyLevelOptions } = useMemo(() => {
    if (!Array.isArray(option)) {
      return {
        sweetOptions: [],
        iceCubeOptions: [],
        sizeOptions: [],
        typeOptions: [],
        addOnsOptions: [],
        spicyLevelOptions: [],
      };
    }

    const getOptions = (name: string) =>
      option
        .find((opt) => opt?.name?.toLowerCase() === name.toLowerCase())
        ?.value?.map((val: string) => ({
          value: val,
          label: val,
        })) || [];

    return {
      sweetOptions: getOptions("sweet"),
      iceCubeOptions: getOptions("ice cube"),
      sizeOptions: getOptions("size"),
      typeOptions: getOptions("type"),
      addOnsOptions: getOptions("add-ons"),
      spicyLevelOptions: getOptions("spiciness level"),
    };
  }, [option]);

  const {
    watch,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      type: "",
      size: "",
      iceCube: "",
      sweet: "",
      note: "",
      spicyLevel: "",
      addOns: "",
    },
  });

  const typeValue = useWatch({ control, name: "type" });
  const typeAdditionalPrice: number = useMemo(() => {
    const filterByType = option.find((opt: any) => opt.name === "Type");
    if (!filterByType) return 0;
    const findIndexSelectedType = filterByType?.value?.findIndex((typeFil: any) => typeFil === typeValue);
    if (findIndexSelectedType === -1) return 0;
    const addPrices = filterByType?.addPrices[findIndexSelectedType];
    if (!addPrices) return 0;
    return addPrices;
  }, [option, typeValue]);

  const sizeValue = useWatch({ control, name: "size" });
  const sizeAdditionalPrice: number = useMemo(() => {
    const filterBySize = option.find((opt: any) => opt.name === "Size");
    if (!filterBySize) return 0;
    const findIndexSelectedSize = filterBySize?.value?.findIndex((sizeFil: any) => sizeFil === sizeValue);
    if (findIndexSelectedSize === -1) return 0;
    const addPrices = filterBySize?.addPrices[findIndexSelectedSize];
    if (!addPrices) return 0;
    return addPrices;
  }, [option, sizeValue]);

  const iceCubeValue = useWatch({ control, name: "iceCube" });
  const iceCubeAdditionalPrice: number = useMemo(() => {
    const filterByIceCube = option.find((opt: any) => opt.name === "IceCube");
    if (!filterByIceCube) return 0;
    const findIndexSelectedIceCube = filterByIceCube?.value?.findIndex(
      (iceCubeFil: any) => iceCubeFil === iceCubeValue
    );
    if (findIndexSelectedIceCube === -1) return 0;
    const addPrices = filterByIceCube?.addPrices[findIndexSelectedIceCube];
    if (!addPrices) return 0;
    return addPrices;
  }, [option, iceCubeValue]);

  const sweetValue = useWatch({ control, name: "sweet" });
  const sweetAdditionalPrice: number = useMemo(() => {
    const filterBySweet = option.find((opt: any) => opt.name === "Sweet");
    if (!filterBySweet) return 0;
    const findIndexSelectedSweet = filterBySweet?.value?.findIndex((sweetFil: any) => sweetFil === sweetValue);
    if (!findIndexSelectedSweet) return 0;
    const addPrices = filterBySweet?.addPrices[findIndexSelectedSweet];
    if (!addPrices) return 0;
    return addPrices;
  }, [option, sweetValue]);

  const addOnsValue = useWatch({ control, name: "addOns" });
  const addOnsAdditionalPrice: number = useMemo(() => {
    const filterByAddOns = option.find((opt: any) => opt.name === "AddOns");
    if (!filterByAddOns) return 0;
    const findIndexSelectedAddOns = filterByAddOns?.value?.findIndex((addOnsFil: any) => addOnsFil === addOnsValue);
    if (!findIndexSelectedAddOns) return 0;
    const addPrices = filterByAddOns?.addPrices[findIndexSelectedAddOns];
    if (!addPrices) return 0;
    return addPrices;
  }, [option, addOnsValue]);

  const spicyLevelValue = useWatch({ control, name: "spicyLevel" });
  const spicyLevelAdditionalPrice: number = useMemo(() => {
    const filterBySpicyLevel = option.find((opt: any) => opt.name === "SpicyLevel");
    if (!filterBySpicyLevel) return 0;
    const findIndexSelectedSpicyLevel = filterBySpicyLevel?.value?.findIndex(
      (spicyLevelFil: any) => spicyLevelFil === spicyLevelValue
    );
    if (!findIndexSelectedSpicyLevel) return 0;
    const addPrices = filterBySpicyLevel?.addPrices[findIndexSelectedSpicyLevel];
    if (!addPrices) return 0;
    return addPrices;
  }, [option, spicyLevelValue]);

  const totalAddPrice: number = useMemo(() => {
    return (
      Number(typeAdditionalPrice) +
      Number(sizeAdditionalPrice) +
      Number(iceCubeAdditionalPrice) +
      Number(sweetAdditionalPrice) +
      Number(addOnsAdditionalPrice) +
      Number(spicyLevelAdditionalPrice)
    );
  }, [
    typeAdditionalPrice,
    sizeAdditionalPrice,
    iceCubeAdditionalPrice,
    sweetAdditionalPrice,
    addOnsAdditionalPrice,
    spicyLevelAdditionalPrice,
  ]);

  const onOrder = (data: FormData): void => {
    const newOrder = {
      ...data,
      quantity,
      name: productDetail.name,
      id: productDetail.id,
      price: Number(productDetail.price) + Number(totalAddPrice),
      img: productDetail.img,
    };
    localStorage.setItem("cart", JSON.stringify([newOrder]));
    onClose();
    router.push("/order-detail");
  };

  const onAddToCart = (data: FormData): void => {
    const newOrder = {
      ...data,
      name: productDetail.name,
      quantity,
      id: productDetail.id,
      price: Number(productDetail.price) + Number(totalAddPrice),
      img: productDetail.img,
    };

    // Get existing cart from localStorage
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    // Find matching item (same id, type, size, iceCube, sweet)
    const existingIndex = cart.findIndex(
      (item: any) =>
        item.name === newOrder.name &&
        item.id === newOrder.id &&
        item.type === newOrder.type &&
        item.size === newOrder.size &&
        item.iceCube === newOrder.iceCube &&
        item.sweet === newOrder.sweet &&
        item.spicyLevel === newOrder.spicyLevel &&
        item.addOns === newOrder.addOns &&
        item.note === newOrder.note
    );

    if (existingIndex !== -1) {
      cart[existingIndex].quantity += newOrder.quantity;
    } else {
      cart.push(newOrder);
    }

    // Save updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    onClose();
    toast.success("Product added to cart", {
      autoClose: 1000,
      position: "top-center",
    });
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  };

  const incrementQuantity = (): void => setQuantity((prev) => prev + 1);
  const decrementQuantity = (): void => setQuantity((prev) => Math.max(1, prev - 1));

  // Handle backdrop click to close modal
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    if (Array.isArray(productDetail?.options)) {
      productDetail.options.map((option: string) => {
        fetcher(`${API_URL}/menus/options/${productDetail?.options[0]}`).then((res) => {
          setOption((prev: any) => [...prev, res?.data]);
        });
      });
    }
  }, [productDetail?.options]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 z-50"
      onClick={handleBackdropClick}
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl w-full max-h-[90vh] overflow-y-auto no-scrollbar"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <ModalHeader onClose={onClose} />

        <div className="p-6 pb-8">
          <ProductInfo
            price={totalAddPrice + Number(productDetail.price)}
            image={productDetail.img}
            title={productDetail.name}
            description={productDetail.desc}
          />

          {/* Type Selection */}
          {typeOptions.length > 0 && (
            <CheckboxGroup name="type" options={typeOptions} label="Type" control={control} errors={errors} />
          )}

          {sizeOptions.length > 0 && (
            <CheckboxGroup name="size" options={sizeOptions} label="Size" control={control} errors={errors} />
          )}

          {iceCubeOptions.length > 0 && (
            <CheckboxGroup name="iceCube" options={iceCubeOptions} label="Ice cube" control={control} errors={errors} />
          )}

          {sweetOptions.length > 0 && (
            <CheckboxGroup name="sweet" options={sweetOptions} label="Sweet" control={control} errors={errors} />
          )}

          {spicyLevelOptions.length > 0 && (
            <CheckboxGroup
              name="spicyLevel"
              options={spicyLevelOptions}
              label="Spiciness Level"
              control={control}
              errors={errors}
            />
          )}

          {addOnsOptions.length > 0 && (
            <CheckboxGroup name="addOns" options={addOnsOptions} label="Add-ons" control={control} errors={errors} />
          )}

          {/* Add Note */}
          <NoteInput control={control} />
        </div>
        <div className="sticky bottom-0 bg-white p-4 border-t w-full">
          {/* Quantity and Price */}
          <motion.div
            className="flex items-center justify-between mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="text-xl font-bold"
              key={quantity * productDetail.price}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
            >
              {formatToIDR(quantity * (Number(productDetail.price) + Number(totalAddPrice)))}
            </motion.div>
            <QuantitySelector quantity={quantity} onIncrement={incrementQuantity} onDecrement={decrementQuantity} />
          </motion.div>
          {/* Action Buttons */}
          <ActionButtons onSubmit={handleSubmit(onOrder)} onAddToCart={handleSubmit(onAddToCart)} />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OrderForm;
