export const makePrefixLabel = ({ required, title }) => {
  const prefix = required ? '[필수]' : '[선택]';

  return `${prefix} ${title}`;
};
