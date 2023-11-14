# This example requires the 'message_content' intent.

import requests
import discord
import os
from dotenv import load_dotenv
from datetime import date, datetime

intents = discord.Intents.default()
intents.message_content = True

client = discord.Client(intents=intents)

load_dotenv()
TOKEN = os.getenv("TOKEN")

@client.event
async def on_ready():
    print(f'We have logged in as {client.user}')

@client.event
async def on_message(message):
    if message.author == client.user:
        return

    if message.content.startswith('$hello'):
        await message.channel.send('Hello!')
    elif message.content.startswith('!daily'):
        await message.channel.send('fetching data...')
        res = requests.get('http://localhost:4000/api/activities')
        data = res.json()
        today = date.today()
        eventsToday = []

        for event in data:
            d = datetime.strptime(event['activityDate'].split('.')[0], '%Y-%m-%dT%H:%M:%S')
            if d.day == today.day and d.month == today.month:
                eventsToday.append(event)

        await message.channel.send(f'`{eventsToday}`')
    # elif message.content.startswith('!file'):
    #     f = discord.File('IMG_4413.JPG')
    #     await message.channel.send(file=f)

client.run(TOKEN)
