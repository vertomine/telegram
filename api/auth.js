import jsonfile from 'jsonfile';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 数据文件路径
const authFile = join('/tmp', 'auth_data.json');

// 初始化数据文件
function initDataFiles() {
  if (!fs.existsSync(authFile)) {
    fs.writeFileSync(authFile, JSON.stringify({
      devices: {},
      used_keys: [],
      created_at: new Date().toISOString()
    }));
  }
}

// 您的500个许可证密钥 - 请替换为实际的密钥
const LICENSE_KEYS = [
    "DH5T5672POD6FBBV", "H7P8Q9WOED7H3M34", "3LJ4WYNVLTSXML45", "0SPS5CJS8PZF0KDY", "L1A3T7F1BA5YJX43", "TTNPA14FIYIPUAY0", "LODLZOX00KLNI0TQ", "5OIWLV6R364PYQPW",
    "HFDYZ6UJCWKBR0DP", "2EH2EV0DVJLXGEO9", "RO7U33K3X495ULP8", "OT9MNMT292A0ZQTU", "S536QNWTURJ8FFC8", "IQXAVPYD4GXS1Q4B", "T4X8J796V6QXOE2Y", "MHPT9A80T0TRSE9P",
    "9V6SFHRDR2EF5RU6", "YOFMGW3MOLN6RNK5", "HTTD3O5F19Z5KG12", "4T9K4XZXXIT86EHJ", "CISVPA0RLMBV5Y65", "TZFUVQBR4Y131P94", "Y8FC4AROD0M95D7M", "ZVG98JT180CWJMT8",
    "6LZEOMDFFITTTY4Y", "A4GOIANOSJDFNDGH", "YYKHP61PQ0ZXSB0P", "K1U15L62Q07NWRSS", "SUF3F2PJQ11GYME2", "FWU42Z8XC8MGU5TR", "KQCIOWTVMW73MYOX", "IJXWUAYGLJ0EHPE7",
    "V02SEAW8ABCZB27H", "MVVPD3DRT1HSAB2B", "LA5OXWO0DKXURXIJ", "O0YZKRT030BOYTF9", "LN7N5NA4QQR7H13S", "63A4RB8D0YPJUCLG", "7IPC0XHTMB2K7X9T", "Y2MBJZVHRFC2Z2RL",
    "WWA8RKIH4SOJA1FK", "8LQBBQRVFF33OGS4", "HWGDFRPVKCY7AK6N", "77GX7BOEB0V8RZIY", "UP70GR6LMEDY15S3", "HOLKFJ66OEBKG8DP", "NZPQ313O1Q043AS6", "B7WHSW2YCRECSN47",
    "RGFK0MASXSPP3KK1", "20ZCOJ8ICFK8NHCD", "SBHEMGIT2410RYYX", "K3SS1RBKDKCZQZNS", "1KZTTX5BFLFPM9OU", "N6XAPXW6IUSPONPZ", "NIE329AZF0ZE777O", "8CH4PL1SEF5RKXWK",
    "9L8E20JQ8N1NVKKE", "CKZZHD2K8FCCWTQ4", "2FYEDKK6NBLQ4G4S", "R2JE42CNJ0E8XNFJ", "SB69DLJZU927D1PR", "XMBBB9A5T9SMTF9E", "E3SC8FCMDBZDM97U", "6JN2CQXFUZVYUKGF",
    "13SM0LPLBH3BPNLR", "ZJASGRPU7XHNUSKZ", "CJHXNCQM5ZUWT7CW", "YJPQ46HCAT98JEM8", "9EM4GIXLI9C78DE8", "DQHZ5ZBQA2FTQQF2", "ANJDTG8GQVF85T2X", "SRCU5NSUO0HA4I2T",
    "BTMQRODAYR5XA8AP", "A18LU30822RF8N2H", "257K741XC2Y3XBML", "YRJIJR690AWBGZXI", "KSS0AK7G8TJWV61C", "0IM4DZDJEI3VN094", "BDZWOZMPXZ0H8WEA", "OWJECZMZYRTF571T",
    "PPZEMNBQZVIQXXSA", "MDSVI0GAJJHUWSRD", "6Q3K6DFSHTCVGHM3", "SDZR0KNDNQF6C3FD", "960LBL780ERC5A9G", "E4SRV49IXWL50ZBT", "MX3MKVTX4KUOOCNM", "N89FG577K7MSXR17",
    "LEGDKL33FXDCPFFX", "VCVN361OMER9NGVU", "5GSEKPOVTRUTNDYG", "Q99KUKI8ZZM0T6A9", "SF2ZQ05ONOXR4J55", "N7AXPA3EON4A3RRN", "CZ728QAM5M1WDEKU", "G3TA5VNWPKU9JPAC",
    "H0OIG834UVF5FP5G", "T82INUA1AWKL4OS8", "QWI72UDBA21SBJI5", "Y9B0OHS4DV6WPE1J", "FB1D81V6V8YOMUAE", "D8ISB85SSTF03YW0", "IPUNDLZG53BW0TJF", "GU3TSGR725MYIAPD",
    "L3NBGVMZ563JPQDM", "SB1EDGU9MH251KAS", "302H44RMTLW8FXFY", "DIQ1988EW94545FX", "05J0I831QZPQBL08", "NURRRT9Y0O67WKB1", "IMUXEK77RUND3J00", "SC4606JFXCH748GU",
    "K2CTY5ARYU3EX4QU", "ZDOR9T78H92IRJ9N", "NOIH94P4GR18BTXI", "TZ69GCRGWPNPPSK1", "JT3BW6SO7MZNF0OS", "KAMTUKC6FYKKU7YT", "V4AWT4G6D68RAQ57", "O83YP2N1888JBHSO",
    "QN6HI9RG9A3DKNDZ", "YD9VHAGFL955R936", "I4OLVF6NQDZVLVC9", "HECOMSFJ4FGIU0LR", "ICUTL572LBM1XWOF", "VFDG4XJNVTPX3QU0", "U2ENSQOANL15IT42", "I8F2VY2ZCFPU8K1B",
    "CJJTMKE28A4PGQJI", "RHMSCFTAGMQMCT1P", "CT1ZR3WCH7V8HGK1", "A898BCNK41Y6HU17", "EJYKESQHS4J44734", "PLV80JVP4T9QBUB4", "NWCJXU7BLGPNZRLB", "XDLJCAHJWSSPSHZF",
    "9ITUGPHQTJF08GO5", "CKD7JQ87EOWS6ND4", "ODAF9EKSM8LEPI75", "RKWVDBE63BDOXFKB", "7FBPYA34FLHMSE1B", "4W1ENL2H7JRFZ726", "3J4TJ11JQ3YK9FJZ", "VXNGLHQL9DTIUGCW",
    "9YO6C3J2YIZGVN7R", "0BQYIL3LQBL8HD70", "UAAA1PMD5NBLEMWU", "IHDC3A9URI2AC9KL", "6KSJXUADQT6PURVK", "R1E52RH6MK4SOWPL", "5O3HJLF8S6CLTF1Z", "3CWKK9T0ZQVKLD8Q",
    "QRKYNINNMZSTY1IT", "326SQWFCD2I548KE", "S9FLK44X3H2KJ5UT", "JYDZZF23U713I8UK", "S4ZSVYRSBE9WA5ZC", "VKCION4WWHOPPTZN", "125ONT2PFN4HU0QL", "2TD5MYBAPW82L0QO",
    "SIP52CZIYN4RUATX", "58MDRR75SKY9V5SR", "NKT3C9EOF024L75F", "K7MSZ1MCVKUOUZK6", "YIXRIDGMK3VBGD58", "LK4M3CS1S9SLP9OC", "JN4USG6QUP8LLMAE", "1Z7PKYTKV5W5Y6XP",
    "T862BCVQI7PLMD77", "YPR2EMUYRI4HQ94K", "32PVLD1Z47J25L2I", "G81SXGDTOXYIP5JN", "V2J8H6D35HZG265J", "K7CHJQP3HRANBYGO", "6F9GWQFAXX3JQWXA", "VU2K085C9MNLY9G5",
    "UPN9110QEEQ7D9P4", "JBQ57ZVQRL1Q3O89", "G8841O1ARGW2Z48E", "4ZCHARKMZH9FSJ14", "FP5RNE2G1UYK9BS6", "EYPWLQAPDBTJCEJG", "PLBTYHE9BQ6F5KUP", "LXSDVBNY103RNB8V",
    "HC1ZBF172SKBOOVD", "8M6A7P5D6J64GAVH", "ICE07GK2L5C3BI6D", "BFSFFEGX9N73JLMZ", "23SV7181SY491NS1", "VX78S0MQD1SH4RM1", "8OHHHRCCTF9STOQ7", "JDX9R43SK4JFSJAA",
    "V214NJKYYC4VIFQY", "H3FX5ZRUPX9S9152", "6BTTRIJXA956NUBB", "WYN64J5353SCPNIM", "5VZ12V7KVT8ZH4TA", "CBHMUHOCW90FKT98", "SU0OYXBCGOPZX842", "JZZLPLML75EN9TCV",
    "AP2KXVFFKYMOAY4Z", "BSN4YJCRMBZY7VQR", "14671ZMJLLICCK3J", "GNA0S0LTM9SWDST1", "9AK22USGXPZY69YZ", "MY4MAS4LX0J84AQO", "AHOEDVUKA8DQPPPN", "IFMOGO2GCVXPN572",
    "EABU584EP02HALC0", "58XN9ODFZKQSLMY9", "OH16BPE1CDDTKFHO", "XXYY4VTOSMDRO5MV", "AGQCOAHLKGK8S2ZA", "ID5L61535YT8XOS9", "ZRGZYDVKL9XTKQV4", "L21R2V8F3Q0V281C",
    "PHPT3U6TTRQO11A2", "4DTMVS9VTPTQ863Z", "9NZU9M64MH47T2N6", "BCW6IJJZ3YP8QR7N", "086E85MJHZ9C6LPL", "56O7BMTXPLPQ9EED", "OEAVAEZBBPTWMR7L", "C9JCG5JYYO3HEILV",
    "76HYP49NLUOB6NRB", "DDPRQHTXNZTKMG11", "9GU19DFEV5GSOVE6", "NP4D67TVHBHT1UB2", "ZDV15XFCS7FKXNHE", "QYXAP7HYT9TF2N3O", "237KU7PUAZG9PTFP", "GL3P3TFY3MX0BHU0",
    "VXIC94M9YCDNTY6Q", "MYFYUV9O3HLT8V8I", "888BQ7UD5TVMYS3F", "NBJ4WT83R66EVKCZ", "ZVHGKY73FE58K6MW", "GBLXYI1313DNZF2Z", "55QMO7NIGEPJVYJT", "L1Y8MKWYOURXLXS5",
    "ACEZJXDZP1MBALFQ", "7OU4MIGVX8NLPZ43", "5CU7NRSQEZ37935L", "2YF2QX53JFNCB9NO", "JZMQI9827O5K1933", "76LPWIXPF8M9M7BW", "F2JHTBAFAAPQ64AO", "8EO68AELIOW4LFJI",
    "3AQ60EDDW0DKAI49", "MR9W9SGLRF8Q9XGC", "83EMA4QZ888XS8AP", "GH7TWGYF4ZGDZKQE", "9J20BL438LHMICHZ", "I7135DTJQT11VTIC", "LQ8QQDH6LLWT2Z83", "OCQP26CNXTIV2U59",
    "BU2W3VRZ5BO8D7TK", "G6L9TE9F2K12ZI8O", "I9NQIB9VVUK5NUGF", "L7KJABD5MP44RTVI", "7R83NTFBEJVKW8X6", "2SOUQQLGER9DN6X3", "RBV0OU03Q466ETL4", "ASGQ6EUAHOY8MBCK",
    "J9TUOK0OZYELNMWW", "I7VJ7EANQBY8PTV1", "V0HGYA46U0VSCVL5", "9Y57A48TWNTHVPGK", "TBM0OLTI5S6BQ47G", "LV67X1KZG3OQN7ZC", "P25Q2AU8HX63AQ6N", "MM1YSQN8UOHXO6WD",
    "HVXJK9922ME9BCBH", "ZMVX4SNV5J0L7H0K", "JTDPHJEGAFBLUENE", "ZSJ09FCW4UPC24NZ", "4NX0KV7D06DSQMA4", "P1DTO8W1H5J4LJXH", "AKYXT4MV79LV7A3X", "HUQZ8SI44TJ9W81R",
    "GYDCC9D7AZ523IMU", "PTE0GWV7F4ZI7WCP", "506Q1OIL2RPZD9C9", "HGIY11U0GZY23ED8", "RXFK5D4HSP2N6PIQ", "XDOSW2JSCG6DTTFC", "5IQ63DRH7MIS40EV", "W7JSPCMZT2YD94C2",
    "XSI9MUNU74N9D8RQ", "W7W0JDTOS5C8E1I7", "JP3DHHR6OIQFH5SM", "X7UCPL6EU8EP3XRA", "PBJMHKMMAPW2NIK2", "JACM1ES0UMD1PORZ", "JQWW3UXL6SOY0CDU", "LRPFDIGKKX7ED0B8",
    "L6VKW4JOMRU294VL", "IH6Z1WDOQQHXTRRO", "N1EV1EDSL293RRQQ", "3ORP9U3UO0ZBZY21", "VZS07IM07TC8DKKZ", "8ZKYBCW4FPDGKVVY", "H97K48DZD26ELG7V", "TTWJ169W6X08XDIF",
    "UN72WA3A1N34MCIX", "DEIDFL7GKB7ACN0Q", "K2FV2KMIG5XNGM1L", "LHAZ2CM0P2OS12EG", "4EAXFFN1CZUZTGET", "3M1CEA5T1F7JMSGO", "JWWCWHJTDZMAOX0O", "7D2JSM60LX1VYR03",
    "C0D8W2RV4CXBBWWA", "YMBC21TLIVF22GJS", "9VW51JG483KVZV7N", "39R5OW3XG3TV6BBD", "91NB9A1NRX074PZY", "WXF8YAJBZS61G8U1", "LUW5RFM098JX42A6", "IUV6G0XPOD4NYIDQ",
    "A5V60E496K8EZFSB", "BMEDA1TKLIVET2UX", "9LOTMF4LGCZ0T4X7", "T5XDKGMYCYT05GHD", "V13KBUIQHXGPIMPZ", "G9FV5G625L2ZNH8L", "BYFPNIXXBZKDMRBF", "UA7R2RQK2Y882M4R",
    "5JVEXPO4U8N9YTHA", "JNG8LB0NBKNBJJTA", "MRV98R41LWJMBNIU", "49YPRSC1OF0XHFJF", "8SG5104R0WGS8HO5", "E74QZIPCLIRLUW29", "0ZIY1XD21NX6EMP7", "HUULQUZ415XK1O65",
    "16ZGUFWVFV1T16SG", "SU2BZ85BA5ZGMVQN", "H9FZAS7JMDSTW7JA", "JBT1E2B2W2098VIJ", "VD1DYH52I3BSA3O6", "F2YWQI2N33SU7Y4G", "HQVKU8T67V680G96", "ELCRLW03855B9ICX",
    "QVA4R6Y6SZYJGP5Y", "3ISMLR54AIZI11P4", "NWD3KLP1O1RW6BSH", "HC2SFRS9NBAZBR4B", "I5UU4X7VNAE3CR67", "4U2CPAS6P624PB0M", "VQOHBLLPO8V83CLS", "8S75BNFHP4DPX1WC",
    "F95KYRKBRJSA5D2F", "G1507RC6SWHJLEY3", "7YI47SYWE0XSBI39", "L45HIGYAGJP0PDV2", "KJ1JU31GMCMDNQJI", "FI5TYZWMFZRMQUO6", "12B9DSBDOF9WUGP0", "WLLDZ9UV7BPVBG0P",
    "3XCW0YP0ONNJGHLY", "RDRYN5RCFWM9SGGY", "SWHH4D4GOXQDI1O8", "6JC9JKN1TQATEVHB", "F5NPZYMFEWA3AY9J", "2FDMNJXC9YEMU96W", "UVZP5FJDVWWEVJD3", "ZB24I8GUOM8EU4H8",
    "CPL0WQ1ZKRW3ZJHY", "WC8JZXNNVIUQ9O0K", "P0K45AEQ9XIS1LGW", "QYEIQWS34SE1MWJ2", "1TPEZ1ZW9VH64CU5", "XU97CPDKKQFEQXY5", "LPGK884560PTPHG6", "36BTIRRLO0D0YYEJ",
    "ZOOLZY0F6C8XW3AU", "3WBA589HDGCUSG78", "41RVYERH2TAQUDOS", "1GQHE0KAYTKJ1GVL", "QD2EU7YWV24FF1IB", "O91BBD6G5PZ6CSY0", "YK75WJHMY3XF9PDK", "JY8G10NO2P7RJK69",
    "PJ8WYZO499WS0S2K", "MSM8VKXI0WZUIZN9", "M2K3618OPOIZPULV", "SMFDWFZP0D8VGB0N", "M5LKB3A8RVUB0VV2", "CLBX64FO1OMDHK8I", "S7OUYZTCHJPVO6BD", "CXHT8SCJGQIISPGG",
    "LOJAEC2RS8IZXQ3R", "V3041UOTS9XLG8AF", "1NN416VEZIELYW65", "J0CTSQQK8N56YO6D", "TD4006F2LCHURUZV", "LUCKVTQ71GCCBOGY", "L22JESAP75NPIX8Y", "LH88WB1OZV9BQS87",
    "TSJA7IOLMI877YVV", "50QQ6W2JW8DMXHR4", "2VM51R8JGHRB7310", "WQ0CW0IWUNVCI9UZ", "YSJ4FBEGANQYIX47", "D7XP9966XWGQGO0S", "JENW6WB4SS84B68B", "JDLZS7BEE2I4I0SQ",
    "PSWF7KD7DUUAIS17", "V1Y1OD5BMZ6OUZ62", "D44Z6SBQ4KI6KWA7", "HTWGB8XW989VAOM0", "BOUJEMUVR0EAY612", "XFMPMO6DZQQ0SYTF", "9I9DTHWVEB61EEI6", "EF5DXY15QIAWNHQO",
    "C0C0DY3DZN9P1R4L", "OC0GD96OANURPQ6G", "HQABN4RLS4J81WG1", "25LF1U9ZWUVBITXB", "E5D1L1899F9WT87Z", "OHRRJTD65E6WLTGA", "U765OG3SNMSRY0HN", "E50IT32EHOAVI089",
    "3EIRKDH8TA8YMYUG", "YIHUMROXEFHQ5NFN", "QGGBTMYMSCCLIQ0Z", "B7ZPGC3N6I9CBW6K", "3PL9JGIR4DYZ03CC", "T4QBD7OKRQENNU21", "56N2YEWYV4084O4D", "B3I4QX72I545VFWV",
    "4J2KUCUNQ4YSWURP", "BWII9DHNLCCNE0H3", "Y8AZE9L2UQ6I91D3", "1GZ0YGB369B17VF6", "M6BC9AQ11X4559ZO", "V6CMOU9K8QDVM2CO", "CTQJ5E0HVARUVGFN", "YS5QCA1IZ52SM3B0",
    "1XWMD50C97ONV985", "A9TQPCBJUIDSA6AZ", "VFGOGBS81ZHIJ879", "CJZ65NGLDLIF62O8", "LBCCXXIYVD7LW1GQ", "VLRGH0VDXSKMVDQS", "FSTHU7NB6HJ16LBL", "3W8O8UHC22J9EWX7",
    "8TB5F440XE5SHLN2", "Y7C96RCV5CTUBJP0", "4A7QSTRV58R8IK7D", "AOPFUO25VFOR2J96", "EW3YKJNDMM4XKFBO", "YLH4796ET8503D39", "JSKT73J5FSWZ8TA4", "HOR186OHOUXI3OPF",
    "E59TBL4WVIVZAC55", "9FN4BYXCAMRB4ZJL", "2PWGC1T8W4BS890G", "SR0W1DUGG6W8BW8X", "BM80FFOBJOJO9GMW", "I9DA4IIXHOYHA7MO", "0461TBWN05VIJO1E", "SU6E09PQ7VRCM8S8",
    "DMWBEU7LQZK53274", "ENK2I28CTUAW1CDD", "AOF31YT82UD51PWJ", "UKSWB7O6O3LQBXOS", "FF04OPFO2ZESS0SV", "QFEN4M00ZHIXRJLX", "XGQBW856GEMVH41A", "5CDLAYSXUVC5GQ0Y",
    "ZZSAT3GHB7UMO1U5", "I9X82LCLB2M15LEM", "33WS51TOQCIQP86V", "N2R9VX3XYM5SQBN1", "2EJC4PUG2TQOY33S", "79KBNCJCJ873EVL3", "5PDFNZBJFKJH5BOW", "GWAK7BV36U461PK0",
    "DQKM5ZJMHMZ6C094", "SVQIUAMFTH0I6M0F", "CK93E2R8Q023SPPS", "C1CGZRIA9RQ785DU", "3TZPSUV5JKOW9JJ0", "ZBM83X5NSF4YW6V4", "LJDXSC7SI5IC0GYR", "TGOVELM8DV3Z35F3",
    "XCGMSLZGQRDGR543", "CVGD7SEVTX8DIVIW", "L8FLPOX7BGMHQU3Q", "P3IPBN1L2WQ3QSLC", "V0S2HXIO9GZ8DRGE", "35JFV9L0AWODJCC6", "C3I2PJIO1XMMSHG8", "7Y374MC0IDFN44I4",
    "1I5AACPJBNXUMXJ9", "3ZJOXAZOG5FZZHLE", "DFY6MJTBDDKBOS08", "JZSSP5Q5T4YX7FD2"
];

export default async function handler(req, res) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // 初始化数据文件
  initDataFiles();
  
  try {
    const { action, device_id, license_key } = req.body;
    
    console.log('收到请求:', { action, device_id, license_key: license_key ? '***' + license_key.slice(-4) : '无' });
    
    switch (action) {
      case 'check_auth':
        return await handleCheckAuth(req, res);
      case 'verify_key':
        return await handleVerifyKey(req, res);
      case 'activate':
        return await handleActivate(req, res);
      case 'get_status':
        return await handleGetStatus(req, res);
      case 'health':
        return res.status(200).json({ status: 'ok', service: 'auth-api' });
      default:
        return res.status(400).json({ success: false, message: '未知操作' });
    }
  } catch (error) {
    console.error('服务器错误:', error);
    return res.status(500).json({ success: false, message: '服务器内部错误' });
  }
}

// 检查授权状态
async function handleCheckAuth(req, res) {
  const { device_id } = req.body;
  
  if (!device_id) {
    return res.json({ authorized: false, message: '缺少设备ID' });
  }
  
  const authData = jsonfile.readFileSync(authFile);
  const deviceAuth = authData.devices[device_id];
  
  if (!deviceAuth || !deviceAuth.authorized) {
    return res.json({ authorized: false, message: '未授权' });
  }
  
  const expiryDate = new Date(deviceAuth.expiry_date);
  const now = new Date();
  
  if (now > expiryDate) {
    return res.json({ 
      authorized: false, 
      message: `授权已过期 (${expiryDate.toLocaleDateString()})` 
    });
  }
  
  const daysRemaining = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
  
  return res.json({
    authorized: true,
    message: '授权有效',
    expiry_date: deviceAuth.expiry_date,
    total_used_keys: deviceAuth.total_used_keys,
    days_remaining: daysRemaining,
    first_activation: deviceAuth.first_activation,
    last_activation: deviceAuth.last_activation
  });
}

// 验证密钥
async function handleVerifyKey(req, res) {
  const { license_key } = req.body;
  
  if (!license_key) {
    return res.json({ valid: false, message: '请输入许可证密钥' });
  }
  
  if (license_key.length !== 16) {
    return res.json({ valid: false, message: '许可证密钥必须是16位' });
  }
  
  const authData = jsonfile.readFileSync(authFile);
  
  const keyIndex = LICENSE_KEYS.indexOf(license_key);
  
  if (keyIndex === -1) {
    return res.json({ valid: false, message: '无效的许可证密钥' });
  }
  
  if (authData.used_keys.includes(license_key)) {
    return res.json({ valid: false, message: '该密钥已被使用' });
  }
  
  return res.json({ 
    valid: true, 
    message: '密钥验证成功',
    key_index: keyIndex 
  });
}

// 激活许可证
async function handleActivate(req, res) {
  const { device_id, license_key } = req.body;
  
  if (!device_id || !license_key) {
    return res.json({ success: false, message: '缺少必要参数' });
  }
  
  // 先验证密钥
  const authData = jsonfile.readFileSync(authFile);
  
  const keyIndex = LICENSE_KEYS.indexOf(license_key);
  
  if (keyIndex === -1) {
    return res.json({ success: false, message: '无效的许可证密钥' });
  }
  
  if (authData.used_keys.includes(license_key)) {
    return res.json({ success: false, message: '该密钥已被使用' });
  }
  
  // 初始化数据结构
  if (!authData.devices) authData.devices = {};
  if (!authData.used_keys) authData.used_keys = [];
  
  const deviceAuth = authData.devices[device_id] || {
    authorized: false,
    total_used_keys: 0,
    first_activation: null,
    last_activation: null,
    expiry_date: null
  };
  
  // 标记密钥为已使用
  authData.used_keys.push(license_key);
  
  // 更新设备授权信息
  deviceAuth.total_used_keys += 1;
  deviceAuth.last_activation = new Date().toISOString();
  
  if (!deviceAuth.first_activation) {
    deviceAuth.first_activation = deviceAuth.last_activation;
  }
  
  // 计算到期时间
  const baseDays = 30;
  const additionalDays = (deviceAuth.total_used_keys - 1) * 30;
  const totalDays = baseDays + additionalDays;
  
  let newExpiry;
  if (deviceAuth.expiry_date) {
    const currentExpiry = new Date(deviceAuth.expiry_date);
    newExpiry = currentExpiry < new Date() ? 
      new Date(Date.now() + totalDays * 24 * 60 * 60 * 1000) :
      new Date(currentExpiry.getTime() + 30 * 24 * 60 * 60 * 1000);
  } else {
    newExpiry = new Date(Date.now() + totalDays * 24 * 60 * 60 * 1000);
  }
  
  deviceAuth.expiry_date = newExpiry.toISOString();
  deviceAuth.authorized = true;
  authData.devices[device_id] = deviceAuth;
  
  // 保存数据
  jsonfile.writeFileSync(authFile, authData, { spaces: 2 });
  
  return res.json({
    success: true,
    message: `授权激活成功！总使用密钥: ${deviceAuth.total_used_keys}个，有效期至：${newExpiry.toLocaleDateString()}`,
    expiry_date: deviceAuth.expiry_date,
    total_used_keys: deviceAuth.total_used_keys
  });
}

// 获取状态
async function handleGetStatus(req, res) {
  const { device_id } = req.body;
  
  if (!device_id) {
    return res.json({
      authorized: false,
      message: '缺少设备ID',
      total_used_keys: 0,
      expiry_date: null,
      days_remaining: 0
    });
  }
  
  const authData = jsonfile.readFileSync(authFile);
  const deviceAuth = authData.devices[device_id];
  
  if (!deviceAuth) {
    return res.json({
      authorized: false,
      message: '设备未激活',
      total_used_keys: 0,
      expiry_date: null,
      days_remaining: 0
    });
  }
  
  const expiryDate = new Date(deviceAuth.expiry_date);
  const now = new Date();
  const daysRemaining = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
  
  return res.json({
    authorized: deviceAuth.authorized && now <= expiryDate,
    message: deviceAuth.authorized && now <= expiryDate ? '授权有效' : '授权无效',
    total_used_keys: deviceAuth.total_used_keys,
    expiry_date: deviceAuth.expiry_date,
    days_remaining: Math.max(0, daysRemaining),
    first_activation: deviceAuth.first_activation,
    last_activation: deviceAuth.last_activation
  });
}