const botEmail = process.env.botEmail
const botPassWord = process.env.TOKEN

const chatexchange = require("chatexchange");

const { ChatEventType } = require("chatexchange");

const main = async () => {
  const myClient = new Client("stackoverflow.com");

  await myClient.login(botEmail, botPassWord);

  const me = await myClient.getMe();

  const myProfile = await myClient.getProfile(me);

  const { roomCount } = myProfile;
  console.log(`Rooms I am in: ${roomCount}`);

  const room = myClient.getRoom(250034);

  room.ignore(ChatEventType.FILE_ADDED);

  const joined = await myClient.joinRoom(room);
  if(joined) {
    room.on("message", async (msg) => {
        console.log("Got Message", msg);

        const { eventType, targetUserId } = msg;

        if (eventType === ChatEventType.USER_MENTIONED && targetUserId === me.id) {
            await msg.reply("Hello World!");
        }

        if(eventType === ChatEventType.USER_LEFT) {
            await msg.send("See you around!", room);
        }
    });

    // Leave the room after five minutes
    setTimeout(async () => {
        await room.sendMessage("Bye everyone!");
        await client.leaveRoom(room);
    }, 3e5);

    // Connect to the room, and listen for new events
    await room.watch();
    return;
  }

  await myClient.logout();
};

main();