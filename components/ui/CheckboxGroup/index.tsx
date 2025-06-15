import { motion, AnimatePresence } from "framer-motion";
import { QuantitySelector } from "@/components/ui";
import { useForm, Controller, Control, FieldErrors } from "react-hook-form";

interface Option {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface FormData {
  type: string;
  size: string;
  iceCube: string;
  sweet: string;
  note: string;
  spicyLevel: string;
  addOns: string;
}

interface CheckboxGroupProps {
  name: keyof FormData;
  options: Option[];
  label: string;
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
}

const optionVariants = {
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
};

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  name,
  options,
  label,
  control,
  errors,
}) => (
  <motion.div
    className="mb-6"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3 }}
  >
    <h3 className="text-neutral-500 font-medium mb-3 text-sm">{label}</h3>
    <Controller
      name={name}
      control={control}
      rules={{ required: `Please select ${label.toLowerCase()}` }}
      render={({ field }) => (
        <div className="flex flex-wrap gap-2">
          {options.map((option, index) => (
            <motion.label
              key={option.value}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border cursor-pointer transition-all ${
                field.value === option.value
                  ? "bg-primary-500 text-white border-teal-700"
                  : "bg-neutral-50 text-gray-700 border-neutral-200 hover:bg-gray-200"
              }`}
              variants={optionVariants}
              whileHover="hover"
              whileTap="tap"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <input
                type="radio"
                value={option.value}
                checked={field.value === option.value}
                onChange={(e) => field.onChange(e.target.value)}
                className="sr-only"
              />
              {option.icon && <span className="text-sm">{option.icon}</span>}
              <span className="text-sm">{option.label}</span>
            </motion.label>
          ))}
        </div>
      )}
    />
    <AnimatePresence>
      {errors[name] && (
        <motion.p
          className="text-red-500 text-xs mt-1"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          {errors[name]?.message}
        </motion.p>
      )}
    </AnimatePresence>
  </motion.div>
);

export default CheckboxGroup;
