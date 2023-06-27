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
import { fetchAllOrders, selectOrderRecord, updateOrder } from '../../../state-control/features/OrderSlice';


type ModalProps = {
    editModalIsOpen: boolean;
    setEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    id?: any;
};
const addOrderSchema = yup.object().shape({
  name: yup.string().required('Required Field'),  
  quantity: yup.string().required('Required Field'),  
  status: yup.string().required('Required Field'),  
  // order_date: yup.string().required('Required Field'),  
  size: yup.string().required('Required Field'),
  spicyness: yup.string().required('Required Field'),
})

const EditOrderModal = ({ editModalIsOpen, setEditModalOpen, id }: ModalProps) => {
  const [errorMessage, setErrorMessage] = useState("");
  const orderRecord = useAppSelector(selectOrderRecord);
  const dispatch = useAppDispatch();

  let initialValues = {
    id: orderRecord.id_ ? orderRecord.id_: "",
    // name: orderRecord.name ? orderRecord.name : "" , 
    quantity: orderRecord.quantity ? orderRecord.quantity : "" ,
    status: orderRecord.status ? orderRecord.status.value : "" ,
    // orderRecord_date: orderRecord.published_date ? new Date(orderRecord.published_date) : new Date(''),
    size: orderRecord.size ? orderRecord.size : "" , 
    spicyness: orderRecord.spicyness ? orderRecord.spicyness.value : ""
  } 

  console.log(initialValues, "IV")

  const {
    register,
    handleSubmit,
    formState: { isSubmitSuccessful, errors, isSubmitting },    
    reset,
  } = useForm<OrderType>({
    resolver: yupResolver(addOrderSchema),
    defaultValues: initialValues
  });

  const onSubmitHandler = async (values:any) => {
    try{
      const submitResponse = await dispatch(updateOrder({...values, id_: initialValues.id})).unwrap();
      if(submitResponse.hasOwnProperty('success') && submitResponse.success == true ){
        Swal.fire({
          position: 'top-end',
          title: 'Content Successfully Created',
          icon: 'success',
          showConfirmButton: false,
          timer: 2000
        })
        setTimeout(() => {
          dispatch(fetchAllOrders());                       
          reset();
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
      <div className="flex flex-col items-center px-4 md:px-5 mb-32 space-y-7">
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

              <div className="w-full">             
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
              </div>
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
                <input
                  type="number"
                  {...register("size")}
                  placeholder="120"
                  className="input-field placeholder-blueGray-300"
                />
                <p className="mb-3">{errors.size?.message}</p>
              </div>

              <div className="w-full mr-3">
                <label
                  className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  htmlFor="spicyness"
                >
                  Page Number
                </label>
                <input
                  type="text"
                  {...register("spicyness")}
                  placeholder="120"
                  className="input-field placeholder-blueGray-300"
                />
                <p className="mb-3">{errors.spicyness?.message as any}</p>
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
