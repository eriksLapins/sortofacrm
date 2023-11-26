export const mapValueToKey = (value: string | null, items: Array<{key: string, title: string}>) => {
  if (!value) {
    return;
  }

  return items.find(item => item.title === value)?.key;
};

export const mapKeyToValue = (value: string | null, items: Array<{key: string, title: string}>) => {
  if (!value) {
    return;
  }

  return items.find(item => item.key === value)?.title;
};
