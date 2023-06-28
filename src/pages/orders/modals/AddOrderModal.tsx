import { useState, useEffect, Fragment } from 'react';
import { ModalProps } from '../../../types/modalprops';
import Modal from '../../../components/Modal';
import { IoClose } from "react-icons/io5";
import * as yup from 'yup';
import { Spinner } from '../../../components/Spinner';
import Swal from "sweetalert2";
import { OrderType } from '../../../types/models';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { createOrder, fetchAllOrders } from '../../../state-control/features/orderSlice';
import { useAppDispatch } from '../../../state-control/store/hooks';
import { useAppSelector } from '../../../state-control/store/store';
import { AuthUser } from '../../../state-control/features/authSlice';



const addOrderSchema = yup.object().shape({
  // name: yup.string().required('Required Field'),  
  quantity: yup.string().required('Required Field'),  
  spicyness: yup.string().required('Required Field'),
  size: yup.string().required('Required Field'),
  status: yup.string().required('Required Field'),  
  // order_date: yup.date().required('Required Field'),  
})

const AddOrderModal = ({ modalIsOpen, setModalOpen }: ModalProps) => {
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { isSubmitSuccessful, errors, isSubmitting },
    reset
  } = useForm<OrderType>({
    resolver: yupResolver(addOrderSchema)
  });
  const isAdmin = false
  const user = useAppSelector(AuthUser)
  console.log(user)

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  useEffect(() => {
    if (isAdmin) {
      dispatch(fetchAllOrders(null));
    } else {
      // Retrieve the userId for the current user from the auth state
      const userId = user.id; // Replace with actual userId retrieval logic
      dispatch(fetchAllOrders(userId));
    }
  }, [dispatch, isAdmin]);

  const onSubmitHandler: SubmitHandler<OrderType> = async (values, e) => {
    e?.preventDefault();
    try {
      const submitResponse = await dispatch(createOrder(values)).unwrap();
                    if(submitResponse){
                      Swal.fire({
                        position: 'top-end',
                        title: 'Order Successfully Created',
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 2000
                      })
                      setTimeout(() => {                                          
                                          reset();
                                          setModalOpen(false);
                                          window.location.reload()
                                        }, 300);
        
                    
                                      }
                                    } catch (err:any) {
                                      console.log(err);
                                      setErrorMessage(err);
                  }   
  };

  const handleCloseModal = () => {
    reset();
    setModalOpen(false);
  };

  return (
    <Fragment>
      {isSubmitting && <Spinner />}
      <Modal modalIsOpen={modalIsOpen} setModalOpen={setModalOpen}>
        <div className="flex items-center justify-end mb-4">
          <button className="text-3xl" onClick={handleCloseModal}>
            <IoClose />
          </button>
        </div>
        <div className="flex flex-col items-center px-4 md:px-5 mb-5 space-y-7">
          <h2 className="text-blue text-3xl">Add Customer Order</h2>
        </div>
        {errorMessage && (
          <div className="animate__animated animate__shakeX bg-red-600 text-white p-4 mb-2">
            {errorMessage}
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
              <p className="mb-3 text-red-500">{errors.quantity?.message}</p>
            </div>

            <div className="w-full">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="status"
              >
                Order Status
              </label>
              <select
                {...register("status")}
                className="input-field placeholder-blueGray-300"
              >
                <option value="">Select Status</option>
                <option value="pending">Pending</option>
                <option value="in-transit">In Transit</option>
                <option value="delivered">Completed</option>
                <option value="canceled">Canceled</option>
              </select>
              <p className="mb-3 text-red-500">{errors.status?.message  as any}</p>
            </div>
          </div>

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
              <p className="mb-3 text-red-500">{errors.size?.message}</p>
            </div>

            <div className="w-full mr-3">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="spiciness"
              >
                Spiciness
              </label>
              <select
                {...register("spicyness")}
                className="input-field placeholder-blueGray-300"
              >
                <option value="">Select Spiciness</option>
                <option value="no-spice">No Spice</option>
                <option value="mild">Mild</option>
                <option value="medium">Medium</option>
                <option value="spicy">Spicy</option>
                <option value="extra-spicy">Extra Spicy</option>
              </select>
              <p className="mb-3 text-red-500">{errors.spicyness?.message as any}</p>
            </div>
          </div>

          <button
            type="submit"
            className="button mt-5 active:bg-gray-600 disabled:bg-gray-500 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </form>
      </Modal>
    </Fragment>
  );
};

export default AddOrderModal;

