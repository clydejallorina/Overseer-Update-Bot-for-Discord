/* Functions/Commands */
function checkNewPost()
{   
    console.log("Checking for a new post...");
    console.log("Previous Post Timestamp: " + newPostTimestamp); //Debug feature.
    
    client.blogPosts('theoverseerproject', { type: 'text', limit: 1, filter: 'text' }, function (err, data) { //Get the first blog post
        if (err != null || err != undefined)
        {
            console.log("Uh oh! Something went wrong!");
        }
        else
        {
            var blog = data; //store it in a variable so that I won't be confused
            var testTimestamp = blog.posts[0].timestamp; //Get post timestamp
            console.log("Post Timestamp: " + testTimestamp);
                
            if (testTimestamp > newPostTimestamp)
            {
                newPostTimestamp = testTimestamp;
                console.log("New post found!");
                botClient.sendMessage("76431126977064960" , "Blog update detected!\n"
                                      + blog.posts[0].post_url + "\n"
                                      + "**" + blog.posts[0].title + "**" + "\n" + "```"
                                      + blog.posts[0].body) + "\n```";
                replaceText(testTimestamp);
            }
            else
            {
                console.log("No new post found!");
            }
        }
    });
}

function replaceText(replaceWithThis)
{
    fs.writeFileSync("timestamp.txt" , replaceWithThis);
}

function retrieveText()
{
    return fs.readFileSync("timestamp.txt");
}

/* Authentication to Discord and Tumblr */
//Discord
var Discord = require("discord.js");
var botClient = new Discord.Client({autoReconnect: true});
//Tumblr
var tumblr = require("tumblr.js");
var client = tumblr.createClient({
        consumer_key: 'Rb9F1n3VlyENKV1tOfSPd7euGAkazokYElbj8Xv2xEv80DiyJH',
        consumer_secret: 'XeMk4MI1kxRJjktELamRwfGY4UryARY9xy2d0LybWYwKNGqQwa',
        token: 's7klWQOBsKAIdR75lJ2OseNtL4FpZrbvtnCcQwc0GoMSqxKkkN',
        token_secret: 'Md6T7VxCtyZkaWWRY84k0n8y83IyfQB90gll44e9oIXVs9k9nM'
    });
//File System (saving and grabbing previous content from last check)
var fs = require("fs");
var newPostTimestamp = retrieveText(); //gathered from Tumblr API Console, will change eventually. Upd8: It did, so...

/* Do [x] when [y] happens */
botClient.on("message" , function(message){
    if (message.content == "=ping")
    {
        botClient.reply("Pong!");
    }
    
    else if (message.content == "=logout") 
    {
        if (message.author.id == "153045798324535296")
        {
            Void.reply(message, "Alrighty then, see ya!");
            setTimeout(1000);
            console.log("Logging out.");
            Void.setStatus("offline", function() {process.exit();});
        }
        else
        {
            Void.reply(message, "You are not gristCollector!");
        }
    }
    
    else if (message.content == "=forcecheck")
    {
        checkNewPost();
    }
    
    else if (message.content.startsWith("=sessioninfo"))
    {
        botClient.reply(message, "There's no API to handle this yet!");
    }
});

/* Show that Discord authentication worked, hopefully. */
botClient.loginWithToken("MjA0MTgzNjkwNjEwMjEyODY0.CmzwYQ.DUJsI3dVIH32p_SvLct7wdY70Bs" , function (err) {
    if (err != null || err != undefined)
    {
        console.log("Whoops! I fucked up!");
    }
    else
    {
        console.log("I'm working properly!");
    }
});

//Check for a new post every 5 seconds
setInterval(function(){
    checkNewPost();
} , 10000);