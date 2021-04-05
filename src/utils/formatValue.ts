import intlConfig from '../config/intl';

const formatValue = (value: number): string => {
  return Intl.NumberFormat(intlConfig.lang, {
    style: 'currency',
    currency: intlConfig.currency,
  }).format(value);
};

export default formatValue;
