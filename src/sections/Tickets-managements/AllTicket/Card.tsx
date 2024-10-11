

export function TicketCartd({data}){
   
  return(
    <div className="p-5 border rounded-md mb-4">
       <div className="flex justify-between gap-4 pb-5">
          <div className="flex gap-4">
          <div className={`w-[1.5rem] h-[1.5rem] rounded-full ${data.Status === "Created" ? "bg-[#F8A534]" : data.Status === "Dispatched" ? "bg-[#3B8AFF]": data.Status === "Technical Finish" ? "bg-[#8E33FF]" : data.Status === "In progress" ? "bg-[#FFAB00]": "bg-[#54C104]" }`}></div>
          <h2 className="text-[16px] text-black font-bold">Ticket #{data.TicketNumber}</h2>
          </div>
          <div>
          <p className="text-[#84818A] text-[14px] font-semibold">Posted at {data.Time}</p>
          </div>
       </div>
       <h4 className="text-black text-[14px] font-semibold pb-2">{data.Title}</h4>
       <p className="text-[#84818A] text-[14px] font-semibold pb-3">{data.Description}</p>
       <hr/>
       <div className="flex gap-4 pt-3 items-center">
        <img src={data.Image} alt="user Image" className="w-[2rem] h-[2rem] rounded-full"/>
        <p className="text-[#84818A] text-[14px] font-semibold">{data.Name}</p>
       </div>
    </div>
  )
}