# Settle Fixer Challenge 

#### Goal
Build an API that allows:

> To create rates by obtaining FX rates from a given provider.
> To add a fee over the obtained FX rate
> To retrieve a list of these rates detailing:
* Pair
* Original rate
* Fee %
* Fee amount
* Rate with fee applied

> Host the solution in an AWS free tier instance.

The candidate must provide a Postman Collection to interact with the API.
### Stack
NodeJS, HapiJS, MongoDB

### Tech
|  |  |
| ------ | ------ |
| aws - ec2 | https://aws.amazon.com/es/ |
| suse | https://www.suse.com/es-es/ |
| nginx | https://www.nginx.com/ |
| node.js | https://nodejs.org/es/ |
| @hapi/hapi | https://hapi.dev/ |
|PM2| https://www.npmjs.com/package/pm2 |
|bluebird|https://www.npmjs.com/package/bluebird|
| mongo db | https://www.mongodb.com/es |
| GitHub | https://github.com/ |

#### API Description

This api is runing on an aws-ec2 suse instance, uses nginx to redirect from port 80 to internal ports, it also uses pm2 to provide server stability.

Only 1 instance of the server is running atm, it could be horizontally escalated as needed, nginx being it's load balancer.

Public DNS:
ec2-52-67-12-244.sa-east-1.compute.amazonaws.com
Redirects you to this page.

This api lets you:

Create any pair of conversion rates supported within the fixer.io acces_key provided.
This is the only path that consumes the fixer.io api, to minimize adding towards the monthly limit usage. 
```
AED,AFN,ALL,AMD,ANG,AOA,ARS,AUD,AWG,AZN,BAM,BBD,BDT,BGN,BHD,BIF,BMD,BND,BOB,BRL,BSD,BTC,BTN,BWP,BYN,BYR,BZD,CAD,CDF,CHF,CLF,CLP,CNY,COP,CRC,CUC,CUP,CVE,CZK,DJF,DKK,DOP,DZD,EGP,ERN,ETB,EUR,FJD,FKP,GBP,GEL,GGP,GHS,GIP,GMD,GNF,GTQ,GYD,HKD,HNL,HRK,HTG,HUF,IDR,ILS,IMP,INR,IQD,IRR,ISK,JEP,JMD,JOD,JPY,KES,KGS,KHR,KMF,KPW,KRW,KWD,KYD,KZT,LAK,LBP,LKR,LRD,LSL,LTL,LVL,LYD,MAD,MDL,MGA,MKD,MMK,MNT,MOP,MRO,MUR,MVR,MWK,MXN,MYR,MZN,NAD,NGN,NIO,NOK,NPR,NZD,OMR,PAB,PEN,PGK,PHP,PKR,PLN,PYG,QAR,RON,RSD,RUB,RWF,SAR,SBD,SCR,SDG,SEK,SGD,SHP,SLL,SOS,SRD,STD,SVC,SYP,SZL,THB,TJS,TMT,TND,TOP,TRY,TTD,TWD,TZS,UAH,UGX,USD,UYU,UZS,VEF,VND,VUV,WST,XAF,XAG,XAU,XCD,XDR,XOF,XPF,YER,ZAR,ZMK,ZMW,ZWL
```
```
POST ec2-52-67-12-244.sa-east-1.compute.amazonaws.com/pair/create/{pair}
```
Check Pairs Existence
```
GET ec2-52-67-12-244.sa-east-1.compute.amazonaws.com/pair/{pair}
```
Get a list of all pairs.
```
GET ec2-52-67-12-244.sa-east-1.compute.amazonaws.com/pair/all
```
Delete Pairs - to re create them with newer rates.
```
POST ec2-52-67-12-244.sa-east-1.compute.amazonaws.com/pair/delete/{pair}
```
Set fees.
```
POST ec2-52-67-12-244.sa-east-1.compute.amazonaws.com/fee/set/{pair}/{fee}
```
Check fees
```
GET ec2-52-67-12-244.sa-east-1.compute.amazonaws.com/fee/{pair}
```
Reset fees.
```
POST ec2-52-67-12-244.sa-east-1.compute.amazonaws.com/fee/reset/{pair}
```
Get All fees.
```
GET ec2-52-67-12-244.sa-east-1.compute.amazonaws.com/fee/all
```
Get currency details
```
GET ec2-52-67-12-244.sa-east-1.compute.amazonaws.com/currency/{currency}
```
Get all currencies details
```
GET ec2-52-67-12-244.sa-east-1.compute.amazonaws.com/currency/all
```

This repository includes the PostMan Json Collection Example.
