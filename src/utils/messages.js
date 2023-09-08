const saveMessages = async ({ from, to, message, time }) => {
  let token = getToken(from, to);
  let data = {
    from,
    message,
    time,
  };
  messageModel.updateOne(
    { userToken: token },
    {
      $push: { message: data },
    },
    (err, res) => {
      if (err) throw err;
      console.log("메시지가 생성되었습니다.", res);
    }
  );
};
