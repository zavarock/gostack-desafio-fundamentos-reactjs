import intlConfig from '../config/intl';

const formatDate = (date: Date): string => {
  return Intl.DateTimeFormat(intlConfig.lang).format(date);
};

export default formatDate;
