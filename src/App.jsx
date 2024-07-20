import { useState, useEffect } from "react"
import Header from "./components/Headers"
import Guitar from "./components/Guitar"
import { db } from "./data/db"

function App() {

  const initialCart = () => {
    const localStorageCart = localStorage.getItem('cart')
    return localStorageCart ? JSON.parse(localStorageCart) : []
  }

  const [data] = useState(db)
  const [cart, setCart] = useState(initialCart)

  const MAX_ITEMS = 5
  const MIN_ITEMS = 1

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  // funcion para manejar logica del carrito
  function addToCart(item) { // recibe el elemento del componente
    // ver si ya existe el elemento
    const itemExist = cart.findIndex(guitar => guitar.id === item.id)
    if (itemExist >= 0) { // existe el carrito
      if (cart[itemExist].quantity >= MAX_ITEMS) return
      // actualizar cantidad
      const updateCart = [...cart] // hacemos una copia de lo que tiene cart
      updateCart[itemExist].quantity++ // sumamos 1 a la cantidad del item o guitar
      setCart(updateCart) // actualizamos cart
    } else {
      item.quantity = 1 // se agrega por primera vez
      setCart([...cart, item]) // agregamos lo que tenga cart, mas el item
    }

    saveLocalStorage()
  }

  // funcionalidad al boton eliminar
  function removeProduct(id) {
    setCart(prevCart => prevCart.filter(guitar => guitar.id !== id)) // si lo pasas como callback vas a tener el valor previo de tu carrito
  }

  function increaseQuantity(id) {
    const updateCart = cart.map(item => {
      if (item.id === id && item.quantity < MAX_ITEMS) {
        return {
          ...item,
          quantity: item.quantity + 1
        }
      }
      return item
    })
    setCart(updateCart)
  }

  function decreaseQuantity(id) {
    const updateCart = cart.map(item => {
      if (item.id === id && item.quantity > MIN_ITEMS) {
        return {
          ...item,
          quantity: item.quantity - 1
        }
      }
      return item
    })
    setCart(updateCart)
  }

  function cleanCart() {
    setCart([])
  }

  return (
    <>
      <Header
        cart={cart}
        removeProduct={removeProduct}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        cleanCart={cleanCart}
      />


      <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>

        <div className="row mt-5">
          {data.map((guitar) => ( // Manda a llamar este componente por cada elemento que tenemos en data
            <Guitar
              key={guitar.id} // cunadp haces una lista de algo, debe llevar un id
              guitar={guitar} // guitar es cada elemento de data
              addToCart={addToCart} // una funcion que usaremos en el componente
            />
          ))}
        </div>
      </main>


      <footer className="bg-dark mt-5 py-5">
        <div className="container-xl">
          <p className="text-white text-center fs-4 mt-4 m-md-0">GuitarLA - Todos los derechos Reservados</p>
        </div>
      </footer>

    </>
  )
}

export default App
