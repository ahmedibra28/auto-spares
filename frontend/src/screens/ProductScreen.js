import React, { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {
  listProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../actions/productActions'
import { confirmAlert } from 'react-confirm-alert'
import { Confirm } from '../components/Confirm'
import { FaTrash, FaEdit } from 'react-icons/fa'

const ProductScreen = () => {
  const [edit, setEdit] = useState(false)
  const [id, setId] = useState(null)
  const [name, setName] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState('')
  const [countInStock, setCountInStock] = useState('')

  const dispatch = useDispatch()
  const productList = useSelector((state) => state.productList)
  const { products, error, loading } = productList

  const productCreate = useSelector((state) => state.productCreate)
  const {
    error: errorCreate,
    loading: loadingCreate,
    success: successCreate,
  } = productCreate

  const productUpdate = useSelector((state) => state.productUpdate)
  const {
    error: errorUpdate,
    loading: loadingUpdate,
    success: successUpdate,
  } = productUpdate

  const productDelete = useSelector((state) => state.productDelete)
  const {
    error: errorDelete,
    loading: loadingDelete,
    success: successDelete,
  } = productDelete

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const formCleanHandler = () => {
    setName('')
    setBrand('')
    setCategory('')
    setCountInStock('')
    setPrice('')
    setEdit(false)
  }

  useEffect(() => {
    dispatch(listProduct())
    if (successCreate || successUpdate) {
      formCleanHandler()
    }
    // eslint-disable-next-line
  }, [dispatch, successCreate, successUpdate, successDelete])

  const deleteHandler = (id) => {
    confirmAlert(Confirm(() => dispatch(deleteProduct(id))))
  }

  const submitHandler = (e) => {
    e.preventDefault()

    edit
      ? dispatch(
          updateProduct({
            id,
            name,
            brand,
            category,
            price,
            countInStock,
          })
        )
      : dispatch(createProduct({ name, brand, category, price, countInStock }))
  }

  const editHandler = (e) => {
    setBrand(e.brand)
    setCategory(e.category)
    setCountInStock(e.countInStock)
    setPrice(e.price)
    setName(e.name)
    setId(e._id)
    setEdit(true)
  }

  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 5
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems =
    products && products.slice(indexOfFirstItem, indexOfLastItem)
  const totalItems = products && Math.ceil(products.length / itemsPerPage)

  return (
    <>
      <div
        className='modal fade'
        id='productModal'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        tabIndex='-1'
        aria-labelledby='productModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog'>
          <div className='modal-content modal-background'>
            <div className='modal-header'>
              <h5 className='modal-title' id='productModalLabel'>
                {edit ? 'Edit Product' : 'Add Product'}
              </h5>
              <button
                type='button'
                className='btn-close'
                data-bs-dismiss='modal'
                aria-label='Close'
                onClick={formCleanHandler}
              ></button>
            </div>
            <div className='modal-body'>
              {successCreate && (
                <Message variant='success'>
                  Product Registered Successfully
                </Message>
              )}
              {loadingCreate ? (
                <Loader />
              ) : (
                errorCreate && <Message variant='danger'>{errorCreate}</Message>
              )}

              {successUpdate && (
                <Message variant='success'>
                  Product Updated Successfully
                </Message>
              )}
              {loadingUpdate ? (
                <Loader />
              ) : (
                errorUpdate && <Message variant='danger'>{errorUpdate}</Message>
              )}
              {loading ? (
                <Loader />
              ) : error ? (
                <Message variant='danger'>{error}</Message>
              ) : (
                <form onSubmit={submitHandler}>
                  <div className='row gy-2'>
                    <div className='form-group'>
                      <label htmlFor='name'>Product Name</label>
                      <input
                        required
                        name='name'
                        onChange={(e) => setName(e.target.value)}
                        type='text'
                        value={name}
                        className='form-control '
                        placeholder='Enter product name'
                      />
                    </div>

                    <div className='form-group'>
                      <label htmlFor='brand'>Product Brand</label>
                      <input
                        required
                        name='brand'
                        onChange={(e) => setBrand(e.target.value)}
                        type='text'
                        value={brand}
                        className='form-control '
                        placeholder='Enter product brand'
                      />
                    </div>

                    <div className='form-group'>
                      <label htmlFor='category'>Product Category</label>
                      <input
                        required
                        name='category'
                        onChange={(e) => setCategory(e.target.value)}
                        type='text'
                        value={category}
                        className='form-control '
                        placeholder='Enter product category'
                      />
                    </div>

                    <div className='form-group'>
                      <label htmlFor='price'>Product Price</label>
                      <input
                        required
                        name='price'
                        onChange={(e) => setPrice(e.target.value)}
                        type='number'
                        min='0'
                        value={price}
                        className='form-control '
                        placeholder='Enter product price'
                      />
                    </div>

                    <div className='form-group'>
                      <label htmlFor='countInStock'>Count In Stock</label>
                      <input
                        required
                        name='countInStock'
                        onChange={(e) => setCountInStock(e.target.value)}
                        type='number'
                        min='0'
                        value={countInStock}
                        className='form-control '
                        placeholder='Enter product count in stock'
                      />
                    </div>

                    <div className='modal-footer'>
                      <button
                        type='button'
                        className='btn btn-secondary'
                        data-bs-dismiss='modal'
                        onClick={formCleanHandler}
                      >
                        Close
                      </button>
                      <button type='submit' className='btn btn-primary'>
                        Submit
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='d-flex justify-content-between align-items-center'>
        <h1 className='fs-6'>Products</h1>
        <button
          className='btn btn-light btn-sm'
          data-bs-toggle='modal'
          data-bs-target='#productModal'
        >
          {' '}
          <i className='fas fa-plus'></i> REGISTER NEW PRODUCT
        </button>
      </div>

      {successDelete && (
        <Message variant='success'>Product Deleted Successfully</Message>
      )}
      {loadingDelete ? (
        <Loader />
      ) : (
        errorDelete && <Message variant='danger'>{errorDelete}</Message>
      )}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <div className='table-responsive'>
            <table className='table table-sm hover bordered striped'>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Stock</th>

                  <th></th>
                </tr>
              </thead>
              <tbody>
                {currentItems &&
                  currentItems.map((prod) => (
                    <tr
                      key={prod._id}
                      style={{ color: `${prod.countInStock < 5 && 'red'}` }}
                    >
                      <td>{prod.name}</td>
                      <td>${prod.price}</td>
                      <td>{prod.countInStock}</td>

                      <td className='btn-group' role='group'>
                        <button
                          className='btn btn-light btn-sm'
                          onClick={(e) => editHandler(prod)}
                          data-bs-toggle='modal'
                          data-bs-target='#productModal'
                        >
                          <FaEdit /> Edit
                        </button>
                        {userInfo && userInfo.isAdmin && (
                          <button
                            className='btn btn-danger btn-sm'
                            onClick={() => deleteHandler(prod._id)}
                          >
                            <FaTrash /> Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {products && !loading && products.length === 0 && (
              <span className='text-danger d-flex justify-content-center'>
                No data found!
              </span>
            )}
            {currentItems && currentItems.length > itemsPerPage && (
              <div className='d-flex justify-content-center'>
                <ReactPaginate
                  previousLabel='previous'
                  previousClassName='page-item'
                  previousLinkClassName='page-link'
                  nextLabel='next'
                  nextClassName='page-item'
                  nextLinkClassName='page-link'
                  pageClassName='page-item'
                  pageLinkClassName='page-link'
                  activeClassName='page-item active'
                  activeLinkClassName={'page-link'}
                  breakLabel={'...'}
                  breakClassName={'page-item'}
                  breakLinkClassName={'page-link'}
                  pageCount={totalItems && totalItems}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={2}
                  onPageChange={(e) => setCurrentPage(e.selected + 1)}
                  containerClassName={'page pagination'}
                />
              </div>
            )}
          </div>
        </>
      )}
    </>
  )
}

export default ProductScreen