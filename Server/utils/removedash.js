const removedash = string => {
  string = string.replace(/[_]/, ' ');
  return string;
};

export default removedash;
