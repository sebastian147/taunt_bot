//node run . lo corre en una terminal 
const Discord = require('discord.js');//include
const bot = new Discord.Client();

const ytdl = require("ytdl-core");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg")
bot.songs = require("./songs.json");
//const token = '';//constraseñá de mi bot para editar
bot.login(process.env.TOKEN);
const PREFIX = '$';

var time = 5000;
var version = 'puto el que lee';

bot.on('ready', () =>{
    console.log('this bot is online!');
})

bot.on('message', msg=>{
   
   let args = msg.content.substring(PREFIX.length).split(" ");
   let argv = msg.content.split(' ').length;;
   switch(args[0])// la primera palabra despues del prefijo
   {
        case 'help':
            msg.channel.send('-ping queres jugar al ping pong capo?\n -clear decime cuantos mensajes queres borrar para arriba');//manda sin @
            break;
        case 'ping':
            msg.channel.send('pong!');//manda sin @
            break;
        case 'info':
            if(args[1] === 'version')
            {
                msg.channel.send(version);
            }
            else
            {
                msg.channel.send('Invalido');  
            }
            break;
        case 'clear':
            if(msg.member.hasPermission('ADMINISTRATOR') || msg.member.roles.cache.some(r=> r.name === 'Hombre poderoso'))
            {
                if(!args[1]) return msg.reply('Error pleas define second arg')
                if(args[1]<20)
                {
                    msg.channel.bulkDelete(args[1]);//borra mensajes
                }
            }
            else
            {
                msg.channel.send('you have no power here');
            }
            break;
        case 'time':
            if(!args[1]) return msg.reply('Error pleas define second arg')
            time = args[1]*1000;   
            msg.channel.send(time/1000);//manda sin @
            break;
        case 'songto':
            if(msg.member.hasPermission('ADMINISTRATOR'))
            {
                if(!args[1]) return msg.reply('Pleas add a link')
                if(!args[2]) return msg.reply('Pleas mention some one')
                if(!ytdl.validateURL((args[1]))) return msg.reply('Pleas enter a valid id')
                if(argv>3) return msg.reply('Too many values')
                if(msg.mentions.users.first() === undefined) return msg.reply('Pleas mention some one valid')
                bot.songs[msg.mentions.members.first().id] = {
                        
                    username: msg.mentions.users.first().username,
                    id: msg.mentions.members.first().id,
                    permission: msg.mentions.members.first().hasPermission('ADMINISTRATOR'),
                    song: args[1],
                    volume:0.5,
                    time: 5000,
                    starttime: '0',
                    quality: 'highest',
                    canchangesong: true
                        
                }
                fs.writeFile("./songs.json", JSON.stringify(bot.songs,null,4), err=> {
                    if(err) throw err;
                console.log('message written');
                });
            }
            else
            {
                msg.channel.send('You have no power here');
            }
            break;
        case 'song':
            if(!args[1]) return msg.reply('Pleas add a link')
            if(!ytdl.validateURL((args[1]))) return msg.reply('Pleas enter a valid id')
            if(argv>2) return msg.reply('Too many values')
            bot.songs[msg.author.id] = 
            {
                username: msg.author.username,
                permission: msg.member.hasPermission('ADMINISTRATOR'),
                song: args[1],
                volume: 0.5,
                time: 5000,
                starttime: '0',
                quality: 'highest',
                canchangesong: true
            }
            fs.writeFile("./songs.json", JSON.stringify(bot.songs,null,4), err=> {
                if(err) throw err;
               console.log('message written');
            });
            break;
   }
   
    /* if(msg.content === "HELLO")
    {
       // msg.reply('Hello'); responde con @ 
    }
    */
})
bot.on('voiceStateUpdate', (oldMember, newMember) => {
    let joined = !!newMember.channelID
    let ojoined = !!oldMember.channelID
    let channel = newMember.channel
    let i = 0;
    let textChannel = oldMember.guild.channels.cache.get('744556273395302415')
    if(joined === true && ojoined === false && newMember.id != '744554217141960735') 
    {
        if(undefined !== bot.songs[newMember.id])
        {
            channel.join()
            .then(connection => {
                 //const dispatcher = connection.playFile("C:\Users\NAME\Documents\Welcome_Bot\music\bossman.mp3");
                var audio = ytdl(bot.songs[newMember.id].song, { filter: 'audioonly'});
                //ffmpeg(audio).toFormat('mp3').seekInput(150).save(audio);
                const dispatcher = connection.play(audio, {seek: bot.songs[newMember.id].starttime});
                console.log("Joined voice channel!");
                dispatcher.on('speaking', (speak) => {if (dispatcher.totalStreamTime > time || speak === true)
                {
                    connection.disconnect();
                    //dispatcher.pause();
                    //channel.leave();
                    }});
                })

                .catch(console.error);
        }
                                             //Random
        /*
            textChannel.send('Invalido');  
            channel.join()
            .then(connection => {
                console.log("Joined voice channel!");
                const dispatcher = connection.play(ytdl('https://www.youtube.com/watch?v=PW4OIHDsWsM' ));

                
                dispatcher.on("end", end => {channel.leave()});
            })
            .catch(console.error);*/
        
    } 
});


