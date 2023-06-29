import React, { useEffect, useState } from 'react';
import Modal from '../../../components/Modal';
import { IoClose } from "react-icons/io5";
import * as yup from 'yup';
import Swal from "sweetalert2";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import 'react-datepicker/dist/react-datepicker.css';
import { OrderType } from '../../../types/models';
import { useAppSelector, useAppDispatch } from '../../../state-control/store/hooks';
import { fetchAllOrders, fetchOrderById, selectOrderRecord, updateOrder } from '../../../state-control/features/orderSlice';


type ModalProps = {
    editModalIsOpen: boolean;
    setEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    id?: any;
};
const addOrderSchema = yup.object().shape({
  // name: yup.string().required('Required Field'),  
  quantity: yup.string().required('Required Field'),  
  // status: yup.string().required('Required Field'),  
  // order_date: yup.string().required('Required Field'),  
  size: yup.string().required('Required Field'),
  spiciness: yup.string().required('Required Field'),
})

const EditOrderModal = ({ editModalIsOpen, setEditModalOpen, id }: ModalProps) => {
  const [errorMessage, setErrorMessage] = useState("");
  const orderRecord = useAppSelector(selectOrderRecord);
  const dispatch = useAppDispatch();
  const orderId = orderRecord.id_ && orderRecord.id_

  let initialValues = {
    id: orderRecord.id_ ? orderRecord.id_: "",
    // name: orderRecord.name ? orderRecord.name : "" , 
    quantity: orderRecord.quantity ? orderRecord.quantity : "" ,
    // status: orderRecord.status ? orderRecord.status.value : "" ,
    // orderRecord_date: orderRecord.published_date ? new Date(orderRecord.published_date) : new Date(''),
    size: orderRecord.size ? orderRecord.size.value : "" , 
    spiciness: orderRecord.spiciness ? orderRecord.spiciness.value : ""
  } 
  

  useEffect( () => {
      dispatch(fetchOrderById(orderId));
  }, [dispatch]);

  console.log(initialValues, "iv")
  console.log(initialValues.id, "orderId")


  const {
    register,
    handleSubmit,
    formState: { isSubmitSuccessful, errors, isSubmitting },    
    reset,
    setValue
  } = useForm<OrderType>({
    resolver: yupResolver(addOrderSchema),
    defaultValues: initialValues
  });

  useEffect(() => {
    setValue("quantity", initialValues.quantity);
    setValue("size", initialValues.size);
    setValue("spiciness", initialValues.spiciness);
  }, [initialValues, setValue]);

  const onSubmitHandler = async (values:any) => {
    try{
      // const userId = localStorage.getItem("userId")
      const submitResponse = await dispatch(updateOrder(values)).unwrap();
      console.log(values, initialValues.id)
      if(submitResponse ){
        Swal.fire({
          position: 'top-end',
          title: 'Content Successfully Created',
          icon: 'success',
          showConfirmButton: false,
          timer: 2000
        })
        setTimeout(() => {
          // dispatch(fetchAllOrders());                       
          reset();
          window.location.reload()
          setEditModalOpen(false);
        }, 300);

      }else{
        let errorResponses = [];
        for (const key in submitResponse.errors) {
          errorResponses.push(submitResponse.errors[key]); 
        }
        const display_err = errorResponses.map((error, index) => (
                <li className="p-1" key={index}>  {error}</li>
        ))
        setErrorMessage(display_err as any)
      }
    } catch (err) {
        console.log(err);
    }   
  }


  return (
    <Modal modalIsOpen={editModalIsOpen} setModalOpen={setEditModalOpen}>
      <div className="flex items-center justify-end mb-4">
        <button className="text-3xl" onClick={() => setEditModalOpen(false)}>
          <IoClose />
        </button>
      </div>
      <div className="flex flex-col items-center px-4 md:px-5 space-y-7">
        <h2 className="text-blue text-3xl">Update Customer Order</h2>
        {errorMessage && (
            <div className="animate__animated animate__shakeX bg-red-600 text-white  p-4 mb-2">
              {" "}
              {errorMessage}{" "}
            </div>
          )}
        <form className="mb-10" onSubmit={handleSubmit(onSubmitHandler)}>
            {/* <div className="mb-3">
                <label
                  className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  htmlFor="name"
                >
                  Customer Name
                </label>

                <input
                  type="text"
                  {...register("name")}
                  placeholder="To read..."
                  className="input-field placeholder-blueGray-300"
                />
                <p className="mb-3 text-red-700">{errors.name?.message}</p>
            </div> */}

            {/* Quantity and Status */}

            <div className="flex mb-3">
              <div className="w-full mr-3">
                <label
                  className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  htmlFor="quantity"
                >
                  Quantity
                </label>
                <input
                  type="number"
                  {...register("quantity")}
                  placeholder="120"
                  className="input-field placeholder-blueGray-300"
                  
                />
                <p className="mb-3">{errors.quantity?.message}</p>
              </div>

              {/* <div className="w-full">             
                <label
                  className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  htmlFor="status"
                >
                  Order Status
                </label>
                <select name="" id="">
                  <option value="">Select Status</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="pending">Completed</option>
                </select>
              
                <p className="mb-3">{errors.status?.message as any}</p>
              </div> */}
            </div>

            {/* date and CImage */}
            <div className="flex mb-3">
            
            <div className="w-full mr-3">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="size"
              >
                Size
              </label>
              <select
                {...register("size")}
                className="input-field placeholder-blueGray-300"
              >
                <option value="">Select Size</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="extra-large">Extra Large</option>
              </select>
              {/* <p className="mb-3 text-red-500">{errors.size?.message}</p> */}
            </div>

              <div className="w-full mr-3">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="spiciness"
              >
                Spiciness
              </label>
              <select
                {...register("spiciness")}
                className="input-field placeholder-blueGray-300"                
              >
                <option value="">Select Spiciness</option>
                <option value="no-spice">No Spice</option>
                <option value="mild">Mild</option>
                <option value="medium">Medium</option>
                <option value="spicy">Spicy</option>
                <option value="extra-spicy">Extra Spicy</option>
              </select>
              <p className="mb-3 text-red-500">{errors.spiciness?.message as any}</p>
            </div>
            </div>
            
            <button
              type="submit"
              className="button mt-5 active:bg-gray-600 disabled:bg-gray-500 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitSuccessful ? "Saving..." : "Save"}
            </button>
          </form>
        
      </div>
    </Modal>
  );
}

export default EditOrderModal ;
