const sendMessage = async (client, message, room) => {

    const db = client.db("SportsPickApp");
    const query = {_id: room };
    const addMessage = { $push: { messages: { ...message } } };

    await db.collection("posts").updateOne(query, addMessage); 
}
;

module.exports = { sendMessage }