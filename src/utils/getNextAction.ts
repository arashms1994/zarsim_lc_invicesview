export const getNextAction = (status: string | null | undefined) => {
  switch (status) {
    case "0":
      return "شروع حمل";
    case "1":
      return "آپلود اسناد حمل";
    case "2":
      return "آماده سازی اسناد";
    case "3":
      return "ارسال اسناد به بانک";
    case "4":
      return "رسید بانک";
    case "5":
      return "تایید اسناد";
    case "6":
      return "واریز مبلغ";
    default:
      return "-";
  }
};
