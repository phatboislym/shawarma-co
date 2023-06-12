import deliveryBoy from '../../assets/delivery-boy.jpg'

const AboutUs = () => {
  return (
   <div className="md:flex p-12">
        <div className="flex justify-center w-[100%]">
            <img src={deliveryBoy} alt="deliveryBoy md:w-[70%]" />
        </div>
        <div className='w-1/2'>
            <h1 className=' text-5xl uppercase mb-5'><span className='text-[#FAA401]'>About </span> Us</h1>
            <p className='text-[1.3rem]'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis, cupiditate voluptatum! Animi suscipit aut dolores expedita eligendi explicabo eius. Facere est eum suscipit obcaecati, tempore impedit officia?</p>
            <p className='text-[1.3rem]'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis consequatur repellendus a vel nam accusamus maiores modi, fugiat, illum laboriosam omnis sapiente odit neque, velit perferendis. Adipisci eveniet inventore ut.</p>            
        </div>
   </div>
  )
}

export default AboutUs