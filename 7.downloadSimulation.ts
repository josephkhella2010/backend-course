type downloadFunctionType = (fileNmae: string) => void;

const downloadFun = (
  url: string,
  downloadCallBack: downloadFunctionType,
): void => {
  setTimeout(() => {
    downloadCallBack(url);
  }, 2000);
};

const downloadFunCallBack = (res: string): void => {
  console.log(` Downloaded data from ${res}`);
};
downloadFun("www.exemple.com", downloadFunCallBack);
