import { useMemo, useEffect, useState } from 'react';
import nookies from 'nookies';

export const useUserRole = () => {
  const [role, setRole] = useState<string>('');

  useEffect(() => {
    const { role } = nookies.get(null); // safe in browser
    setRole(role);
  }, []);

  return useMemo(() => ({
    role,
    isCustomer: role === 'customer',
    isCashier: role === 'cashier',
    isBarista: role === 'barista',
    isAdmin: role === 'admin',
  }), [role]);
};