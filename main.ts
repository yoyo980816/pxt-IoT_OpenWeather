/**
 *IoT implementation method.
 */
//% weight=10 color=#096670 icon="\uf1eb" block="IoT_OpenWeather"
//% groups=["01_Weather"]
namespace IoT_OpenWeather {

    let wInfo: string[][] = [
        ["weather", "main", "", "s"],
        ["description", "description", "", "s"],
        ["temperature", "\"temp\"", "", "k"],
        ["humidity", "dity", "", "n"],
        ["temp_min", "temp_min", "", "k"],
        ["temp_max", "temp_max", "", "k"],
        ["speed", "speed", "", "n"],
        ["sunrise", "sunrise", "", "n"],
        ["sunset", "sunset", "", "n"],
        ["timezone", "timezone", "", "n"],
        ["cityName", "name", "", "s"]
    ]

    export enum wType {
        //% block="city name"
        cityName = 10,
        //% block="weather"
        weather = 0,
        //% block="description"
        description = 1,
        //% block="temperature"
        temperature = 2,
        //% block="humidity"
        humidity = 3,
        //% block="low temperature"
        temp_min = 4,
        //% block="maximum temperature"
        temp_max = 5,
        //% block="wind speed"
        speed = 6,        
        //% block="time of sunrise"
        sunrise = 7,
        //% block="time of sunset"
        sunset = 8
    }

    export enum cityIDs {
        //% block="Taipei"
        Taipei = 1668341,
        //% block="Hong Kong"
        HongKong = 1819729,
        //% block="Tokyo"
        Tokyo = 1850147,
        //% block="Seoul"
        Seoul = 1835848,
        //% block="Beijing"
        Beijing=1816670,
        //% block="Shanghai"
        Shanghai=1796236,      
        //% block="Singapore"
        Singapore=1880252, 
        //% block="London"
        London=2643743, 
        //% block="Berlin"
        Berlin=2950159, 
        //% block="Paris"
        Paris= 2988507,
        //% block="New York"
        NewYork=5128638, 
        //% block="Sydney"
        Sydney=2147714 
    }

    export enum city2IDs {
        //% block="Keelung"
        Keelung = 6724654,
        //% block="Taipei"
        Taipei = 1668341,
        //% block="Xinbei"
        Xinbei = 1670029,
        //% block="Taoyuan"
        Taoyuan = 1667905,
        //% block="Hsinchu"
        Hsinchu = 1675107,
        //% block="Miaoli"
        Miaoli = 1671971,
        //% block="Taichung"
        Taichung = 1668399,
        //% block="Changhua"
        Changhua = 1679136,
        //% block="Nantou"
        Nantou = 1671564,
        //% block="Yunlin"
        Yunlin = 1665194,
        //% block="Jiayi"
        Jiayi = 1678836,
        //% block="Tainan"
        Tainan = 1668352,
        //% block="Kaohsiung"
        Kaohsiung = 7280289,
        //% block="Pingtung"
        Pingtung = 1670479,
        //% block="Yilan"
        Yilan = 1674197,
        //% block="Hualien"
        Hualien = 1674502,
        //% block="Taitung"
        Taitung = 1668295,
        //% block="Penghu"
        Penghu = 1670651,
        //% block="Jincheng"
        Jincheng = 1678008,
        //% block="Nangan"
        Nangan = 7552914
    }

    function IoTWriteString(text: string): void {
        serial.writeString(text)
    }
    
    /*
    function startWork():void{
        basic.clearScreen()
        led.plot(1, 2)
        led.plot(2, 2)
        led.plot(3, 2)
    }
    */

    function getTimeStr(myTimes: number): string {
        let myTimeStr = ""
        let secs = myTimes % 60
        let mins = Math.trunc(myTimes / 60)
        let hours = Math.trunc(mins / 60)
        mins = mins % 60
        hours = hours % 24
        if (hours < 10)
            myTimeStr = "0" + hours
        else
            myTimeStr = "" + hours
        myTimeStr += ":"
        if (mins < 10)
            myTimeStr = myTimeStr + "0" + mins
        else
            myTimeStr = myTimeStr + mins
        myTimeStr += ":"
        if (secs < 10)
            myTimeStr = myTimeStr + "0" + secs
        else
            myTimeStr = myTimeStr + secs
        return myTimeStr
    }


    /**
     * return the city ID in the world 
     * 取得某個全球大都市的城市編號
    */ 
    //% weight=95 group="01_Weather"
    //% blockId=getCityID blockGap=5
    //% block="get City ID of %myCity"
    export function getCityID(myCity: cityIDs): string {
        return ("" + myCity)
    }

    /**
     * return the city ID in Taiwan 
     * 取得台灣某個都市或是縣的城市編號
    */ 
    //% weight=94 group="01_Weather"
    //% blockId=getCity2ID blockGap=5
    //% block="get City ID of %myCity | in Taiwan"
    export function getCity2ID(myCity: city2IDs): string {
        return ("" + myCity)
    }

    /**
     * return the weather information about the city from http://openweathermap.org/ 
     * 取得從 http://openweathermap.org/ 得到的某一項氣象資訊
    */
    //% weight=93 group="01_Weather"
    //% blockId=getWeatherInfo blockGap=5
    //% block="get weather data: %myInfo"
    export function getWeatherInfo(myInfo: wType): string {
        return wInfo[myInfo][2]
    }

    /**
     * connect to https://openweathermap.org/ to get the weather information
     * You have to enter the City ID and your access key of the website
     * 連接到 https://openweathermap.org/ 取得氣象資訊
     * 你必須輸入城市編號以及你在這個網站註冊取得的存取密碼才能查詢該城市的氣象資訊
     * @param myCity to myID ,eg: "City Number"
     * @param myInfo to myKey ,eg: "access key"
    */
    //% weight=96 group="01_Weather"
    //% blockId=setWeatherHttp blockGap=5
    //% block="set city ID to get the weather information: %myID | OpenWeatherMap key: %myKey"
    export function setWeatherHttp(myCity: string, myInfo: string): void {
        IoT_serial_init()
        basic.showLeds(`
        . . . . .
        # . # . #
        . # # # .
        . . # . .
        . . . . .
        `)
        cityID = myID
        weatherKey = myKey
        let item = ""
        let returnCode = ""
        let tempNumber = 0
        let tempStr = ""
        let myUrl = "http://api.openweathermap.org:80/data/2.5/weather?id=" + cityID + "&appid=" + weatherKey
        serial.readString()
        IoTWriteString("|3|1|" + myUrl + "|\r")
        for (let i = 0; i < 3; i++) {
            returnCode = serial.readUntil("|")
        }
        if (returnCode == "200") {
            for (let i = 0; i < wInfo.length; i++) {
                item = serial.readUntil(":")
                while (item.indexOf(wInfo[i][1]) < 0) {
                    item = serial.readUntil(":")
                }
                item = serial.readUntil(",")
                switch (wInfo[i][3]) {
                    case "s":
                        wInfo[i][2] = item.substr(1, item.length - 2)
                        break
                    case "k":
                        if (item.indexOf("}") != -1) {
                            item = item.substr(0, item.length - 1)
                        }
                        wInfo[i][2] = "" + Math.round(parseFloat(item) - 273.15)
                        break
                    case "n":
                        if (item.indexOf("}") != -1) {
                            item = item.substr(0, item.length - 1)
                        }
                        wInfo[i][2] = item
                        break
                    default:
                        wInfo[i][2] = item.substr(1, item.length - 2)
                }
            }
            let riseTime = parseFloat(wInfo[7][2])
            let setTime = parseFloat(wInfo[8][2])
            let timeZone = parseFloat(wInfo[9][2])
            riseTime += timeZone
            setTime += timeZone
            wInfo[7][2] = getTimeStr(riseTime)
            wInfo[8][2] = getTimeStr(setTime)
            basic.showIcon(IconNames.Yes)
        }
        else {
            for (let i = 0; i < wInfo.length; i++) {
                wInfo[i][2] = ""
            }
            basic.showIcon(IconNames.No)
        }
    }
