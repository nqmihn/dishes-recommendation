import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage/HomePage';
import ProductDetailPage from './pages/ProductDetailPage/ProductDetailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
