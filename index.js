const fetch = require("node-fetch")
const Client = require("chatexchange");
const { ChatEventType } = require("chatexchange");

const botEmail = process.env.botEmail
const botPassWord = process.env.botPassWord
const API_KEY = process.env.Key; // Your API_KEY
const Access_Token = process.env.Token; // Your Access_Token
const Site_Name = 'stackoverflow'; // Change site name if needed
const Room_ID = '167908'; // Room to send message

const main = async () => {
  const client = new Client['default']("stackoverflow.com");

  async function getComments() {
    const response = await fetch(`https://api.stackexchange.com/2.2/comments?page=1&pagesize=100&order=desc&sort=creation&filter=!4(lY7*YmhBbS4j1g_&site=stackoverflow&key=${API_KEY}`)
    const data = await response.json()

    return data
  }
  
  async function filterComments() {
    const result = await getComments()
    const comments = result.items
    const quota = result.quota_remaining
  
    const thanksRegex = new RegExp(`((?:^)@(\\w+)\\b\\s)?thank([\\w.,!\']*)?(\\s[\\w{1,8},.@!:\\-)]*)?(\\s[\\w{1,8},.@!:\\-)]*)?(\\s[\\w{1,8},.@!:\\-)]*)?`)
    const gladRegex = new RegExp(`glad(?:\\sto\\shelp|hear)?`)
    const goodSolutionRegex = new RegExp("(appreciate|perfect|awesome|amazing|excellent)(?:,|\w{1,2})?(\\s(?:solution|example)?)?")
    const solveRegex = new RegExp("solv(\\w{1,3})(\\s(\w{2,5}))\\s(\\w{1,9})?")
    const upvoteRegex = new RegExp("(\\w{1,8}\\s)?up(?:\\s)?vote\\s(\\w{0,8})?\\s(\\w{0,8})?")
    const workRegex = new RegExp("(\\w{1,5}([\\w{,2}\']*)\\s)?work([\\w*{0,3}!.]*)?(\\s[:\\-)+=.}]*)?")
    const saveRegex = new RegExp("save(\\w{1,3})?\\s(\\w{0,4})\\s([\\w{0,6}.!:\\-)]*)?")
    const thanksButNotRegex = new RegExp("([\\w{1,8},.@!:)]*\\s)?(love|cheers|great)(\\s[\\w{1,8},.@!:)]*)?")
    const smilyFaceRegex = new RegExp(":\\)| :-\\)|;\\)")

    const butRegex = new RegExp("not|unfortunate|but|require|need|persists")
    const dontRegex = new RegExp("\\b(doesn|don|didn|couldn|can|isn)(['’])?(\\w{1,2})?\\b")
    const questionMarkRegex = new RegExp("[?]")
  
    for (let i = 0; i < comments.length; i++) {
      const thisComment = comments[i].body_markdown.toLowerCase();
      let score = 0
  
      if (thisComment.match(thanksRegex)) {
        score += 1
      }
  
      if (thisComment.match(gladRegex)) {
        score += 1
      }
  
      if (thisComment.match(goodSolutionRegex)) {
        score += 1
      }
  
      if (thisComment.match(solveRegex)) {
        score += 1
      }
  
      if (thisComment.match(upvoteRegex)) {
        score += 1
      }
  
      if (thisComment.match(workRegex)) {
        score += 1
      }
  
      if (thisComment.match(saveRegex)) {
        score += 1
      }
  
      if (thisComment.match(smilyFaceRegex)) {
        score == 1
      }
  
      if (thisComment.match(thanksButNotRegex)) {
        score += 1
      }

      if (thisComment.match(butRegex)) {
        score -= 1
      }

      if (thisComment.match(dontRegex)) {
        score -= 1
      }

      if (thisComment.match(questionMarkRegex)) {
        score -= 1
      }

      if (score > 0) {
       // sendsa a message
        client.send(`${thisComment} \n Score: ${score}`)
      }
    }
  }
  
  await client.login(botEmail, botPassWord);

  const me = await client.getMe();

  const myProfile = await client.getProfile(me);

  const { roomCount } = myProfile;
  console.log(`Rooms I am in: ${roomCount}`);

  const room = client.getRoom(Room_ID);

  const joined = await client.joinRoom(room);

  // setTimeout(filterComments(), 60000) // 60000 is 1 minute
  
  if(joined) {
    room.on("message", async (msg) => {

        const { eventType, targetUserId } = msg;

        if (eventType === ChatEventType.USER_MENTIONED && targetUserId === me.id) {
            await msg.reply(`Hi @${message.user}. Unfortently I dont have any commands (including feedback) as of now.`);
            console.log("Got Message", msg);
        }
    });

    // Connect to the room, and listen for new events
    await room.watch();
    return;
  }

  await client.logout();
};

main();