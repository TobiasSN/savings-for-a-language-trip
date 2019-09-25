[Try it here](savings-for-a-language-trip.tobias-sn.ml)

A web app made for a school assignment I got. It goes as follows:

Emil is going on a language trip in the summer to get better at English. He has to choose whether to go to England, USA or Malta.

His parents are gonna pay half of the costs involved, and Emil has to pay the rest.

The following parameters are involved:
- How long? (2-4 weeks)
- If in Malta, at a hotel or a host family.
- Should he go for an extra thing on top? (For example a diving course)

He also has to pay for a flight ticket and insurance, and he's been recommended to bring some pocket money.

Emil needs to save up for this by working at different part-time jobs:
- Delivery boy (I decided not to include this one because he can earn more money at the other two)
- Clerk at a bakery.
- Checking tickets and more in a cinema

He'll be working at these jobs from the starting of the school year to the end (46 weeks).

All the money he earns for the trip is put into the bank, which pays 5% interest every year on the 31st of December.

Data is in `src/assets/data.json`.

## Building and running
If you for some reason wanna do that.

### Install dependencies
```
npm install
```

### Compile and run locally
```
npm run serve
```

### Compile and optimize
```
npm run build
```
Output will be in the folder `dist`.