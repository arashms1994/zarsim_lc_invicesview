export const getNextAction = (status: string | null | undefined) => {
  switch (status) {
    case "0":
      return "شروع حمل";
    case "1":
      return "آماده سازی اسناد";
    case "2":
      return "ارسال اسناد به بانک";
    case "3":
      return "رسید بانک";
    case "4":
      return "تایید اسناد";
    case "5":
      return "واریز مبلغ";
    default:
      return "-";
  }
};
