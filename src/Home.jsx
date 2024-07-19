import { useEffect, useState } from 'react'
import './home.css'
import { TbPointFilled } from "react-icons/tb";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const api = {
    key: "f263de731b8a4934a9b75218241807",
    base: "http://api.weatherapi.com/v1"
}

export default function Home(){
    const [city,setCity] = useState(null);
    const [data,setData] = useState(undefined);
    const weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

    useEffect(()=>{
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition((response)=>{
                let lat = response.coords.latitude;
                let long = response.coords.longitude;
                console.log(response);
                console.log(lat + " "+ long);
                fetch(`${api.base}/forecast.json?key=${api.key}&q=${lat},${long}&days=6`).then(response=>response.json()).then((data)=>{
                    setData(data);
                    console.log(data);
                })
            });
        }else{
            alert("Geolocation not supported. Enter location manually in the search bar");
        }
    },[])

    const calculateUv = ()=>{
        let uv = data.current.uv;
        let a;
        if(uv<4){
            a="Low"
        }else if(uv>=4 && uv<=7){
            a="Moderate"
        }else if(uv>7 && uv<=10){
            a="High"
        }else{
            a="Extreme"
        }
        return a;
    }
    const calculateUvPercent = ()=>{
        let uv = data.current.uv;
        let percent;
        if(uv>=11){
            return 99;
        }else{
            percent = (uv/11)*100;
        }
        return percent;
    }

    const search = (e)=>{
        if(e.key === "Enter"){
            fetch(`${api.base}/forecast.json?key=${api.key}&q=${city}&days=6`).then(response=>response.json()).then((data)=>{
               setData(data);
               console.log(data); 
            }).catch((err)=>{
                alert(err);
            });
        }
    }

    return(
        <div className='min-h-[2vh] w-full'>
            <div id='search-container' className='w-6/12 mx-auto'>
                <input type='text' 
                placeholder='Search...'
                onChange={(e)=>setCity(e.target.value)}
                onKeyPress={search}
                className='w-full rounded-b-3xl box-border py-3 px-8 text-white font-semibold' 
                id='search'
                />
            </div>
            <div id='weather-display-container'
            className='w-10/12 mx-auto rounded-md min-h-[80vh] mt-12'>
                {
                    data ? 
                    <div id='weather-display w-full'>
                        <div id='temp-display'
                        className="flex flex-col w-full justify-center items-center text-white">
                            <h3 className='text-2xl font-medium mt-4'>{data.location.name}<span className='text-xl'>, {data.location.country}</span></h3>
                            <h1 className='text-6xl font-semibold my-4'>{data.current.temp_c} °C</h1>
                            <p className='text-lg mb-4'><img src={data.current.condition.icon} alt={data.current.condition.text} className='inline w-12'/> {data.current.condition.text}</p>
                        </div>
                        <div id='forecast-display' className='grid grid-cols-2 grid-rows-7 bg-[rgba(71,85,105,0.7)] rounded-2xl text-white my-4 p-4 box-border h-content'>
                            <div className='row-span-1 col-span-2 mb-2'>
                                Forecast (6 days)
                                <hr/>
                            </div>
                            {
                                data.forecast.forecastday.map((day,index)=>{
                                    const currDay = new Date().getDay();
                                    const forecastDay = new Date(day.date).getDay();
                                    let displayDay;
                                    if(forecastDay-currDay===0){
                                        displayDay = "Today";
                                    }else{
                                        displayDay = weekdays[forecastDay]
                                    }
                                    return <div key={index} className='row-span-2 flex items-center justify-start hover:bg-[rgba(71,85,105,0.3)] mx-4 pl-2'>
                                        <p className='text-xl mx-2 w-3/12'>{displayDay}</p>
                                        <p className='text-sm w-5/12'><img src={day.day.condition.icon} alt={day.day.condition.text} className='inline w-12'/> {day.day.condition.text}</p>
                                        <p className='w-2/12 text-lg font-medium'>{day.day.avgtemp_c} °C</p>
                                    </div>
                                })
                            }
                        </div>

                        <div id='wind&uv' className=' w-full my-4 box-border flex justify-between items-start'>
                            <div id='wind-container' className='w-[47%] bg-[rgba(71,85,105,0.7)] rounded-xl flex flex-col p-4 text-white'>
                                <p className='text-xs font-medium'>Winds</p>
                                <hr/>
                                <div className='hover:bg-[rgba(71,85,105,0.3)] flex justify-between items-center py-2 px-4 mt-4'>
                                    <p>Wind speed</p>
                                    <p className='text-lg font-medium'>{data.current.wind_kph} kmph</p>
                                </div>
                                <div className='hover:bg-[rgba(71,85,105,0.3)] flex justify-between items-center py-2 px-4'>
                                    <p>Wind direction</p>
                                    <p className='text-lg font-medium'>{data.current.wind_degree}° {data.current.wind_dir}</p>
                                </div>
                            </div>

                            <div id='uv-container' className='w-[47%] rounded-xl box-border p-4 flex flex-col bg-[rgba(71,85,105,0.7)] text-white'>
                                <p className='text-xs font-medium'>UV index</p>
                                <hr/>
                                <p className='text-2xl font-medium mt-2 px-2'>{data.current.uv}</p>
                                <p className='text-lg px-2'>{calculateUv()}</p>
                                <div className='min-w-[95%] max-w-[95%] min-h-1 max-h-1 mx-auto relative my-4 box-border' id='uv-bar'>
                                    <TbPointFilled className='absolute top-[-6px] border-[2px] m-0 border-white box-border rounded-full' style={{left:`${calculateUvPercent()}%`}}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <div className='w-full h-full flex items-center justify-center'>
                        <AiOutlineLoading3Quarters id='loading' className='font-[800] text-[5rem]'/>
                    </div>
                }                   
            </div>
        </div>
    )
}