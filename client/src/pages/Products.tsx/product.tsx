import { useEffect, useState } from "react";
import type { Product } from "../../components/types";
import { categoriesData } from "../../assets/assets";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { ChevronDown, Home, SlidersHorizontal, XIcon } from "lucide-react";
import ProductCard from "../../components/Home/ProductCard";
import Loading from "../../components/Loading/Loading";
import FilterPanel from "../../components/FiilterPanel/FilterPanel";
import api from "../../config/api";
import toast from "react-hot-toast";


const Products = () => {

  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([])

  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);

  const [mobileFiltersOpen, setMobileFitersOpen] = useState(false)

  const category = searchParams.get("category") || "";
  const organic = searchParams.get("organic") || "";
  const sort = searchParams.get("sort") || ""
  const page = searchParams.get("page") || 1;
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  async function fetchProducts() {
    setLoading(true)
    try{
     const params = new URLSearchParams()
     if(category) params.set('category', category)
     if(organic) params.set('organic', organic)
     if(sort) params.set('sort', sort)
     if(sort) params.set('sort', sort)
     if(maxPrice) params.set('maxPrice', maxPrice)
      params.set("page", String(page))
      params.set("limit", "12")

     const {data} = await api.get(`/products?${params.toString()}`)
     setProducts(data.products)
     setTotalPages(data.pages)
    }catch(error: any) {
     toast.error(error?.response?.data?.message || error?.message)
    }finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [category, organic, sort, page, minPrice, maxPrice])
  
   function updateFilter (key: string, value: string) {
    const newParams = new URLSearchParams(searchParams)
    if(value) {
     newParams.set(key, value)
    }else {
      newParams.delete(key)
    }

    if(key !== "page") {
      newParams.delete("page")
    }
    setSearchParams(newParams)
   }

   function clearFilters() {
    setSearchParams({})
   }

    const activeCategory = categoriesData.find((c) => c.slug === category);
    const hasFilters = category || organic || minPrice || maxPrice;

    return (
      <div className="min-h-screen bg-app-cream">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

       <nav className="flex items-center gap-2 text-app-text-light mb-6">
        <Link to='/' className="hover:text-app-green transition-colors">
         <Home className="size-5"/>
        </Link>
        <span>/</span>
        <span className="text-app-green font-medium">{activeCategory ? activeCategory.name : "All Products"}</span>
       </nav>

       <div className="flex gap-8 xl:gap-10">
         {/*Sidebar - desktop */}
         <aside className="hidden lg:block w-64 shrink-0">
          <div className="bg-white rounded-2xl p-4 sticky top-24">
            <FilterPanel 
            categories={categoriesData}
            category={category}
            organic={organic}
            minPrice={minPrice}
            maxPrice={maxPrice}
            updateFilter={updateFilter}
            clearFilters={clearFilters}
            hasFilters={hasFilters}
            />
          </div>
         </aside> 

         <main className="flex-1">
          <div className="flex items-center justify-between mb-6">
           <div>
             <h1 className="text-2xl font-semibold text-app-green">
              {activeCategory ? activeCategory.name : "All Products"}
             </h1>
             <p className="text-sm text-app-text-light mt-0.5">
               {products.length} products found
             </p>
           </div>

           <div className="flex flex-col lg:items-center gap-3"> 
             {/*mobile filter */}
            <button onClick={()=> setMobileFitersOpen(true)} 
              className="lg:hidden flex items-center gap-2 px-3 py-2 text-sm bg-white rounded-xl border border-app-border hover:bg-app-cream transition-colors">
              <SlidersHorizontal className="size-5"/> Filters
            </button>

            {/*sort */}
             <div className="relative">
              <select value={sort} onChange={(e) => updateFilter("sort", e.target.value)}
               className="appearance-none pl-3 pr-8 py-2 text-sm bg-white rounded-xl border border-app-border focus:border-app-border outline-none cursor-pointer"
              >
               <option value="">Newest</option>
               <option value="price_asc">Price: Low Hight</option>
               <option value="price_desc">Price: High Low</option>
               <option value="rating">Top Rated</option>
               <option value="name">A - Z</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-app-text-light pointer-events-none cursor-pointer"/>
             </div>
           </div>
          </div>

           {loading ? (
            <Loading/>
           ) : products.length === 0 ? (
             <div className="text-center py-16">
              <p className="text-lg font-semibold text-app-green mb-2">No products found</p>
              <p className="text-sm text-app-text-light mb-4">
                Try adjusting your filters or search terms
              </p>
              <button onClick={clearFilters}
              className="px-30 py-20 text-sm font-medium bg-app-green text-white rounded-xl hover:bg-app-green-light transition-colors">
                Clear Filters
              </button>
             </div>
           ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 xl:gap-8">
              {products.map((product) => product.stock > 0 && (
                <ProductCard key={product.id} product={product}/>
              ))}
            </div>
           )}

           {totalPages > 1 && (
            <div className="flex-center gap-2 mt-16">
             {Array.from({length: totalPages}).map((_, i) => (
              <button key={i} onClick={()=> {updateFilter("pages", String(i+1)); scrollTo(0,0)}}
              className={`size-9 rounded-lg text-sm font-medium transition-colors 
              ${page === i + 1 ? "bg-app-green text-white" : "bg-white text-app-text-light hover:bg-app-cream"}`}>
                {i + 1}
              </button>
             ))}
            </div>
           )}
         </main>
       </div>
       </div>

       {mobileFiltersOpen && (
         <>
          <div className="fixed inset-0 bg-black/40 z-50" onClick={() => setMobileFitersOpen(false)}/>

         <div className="fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-2xl max-h-[80vh] overflow-y-auto animate-slide-in-up">
          <div className="flex items-center justify-between p-4 border-b border-app-border">
            <h3 className="text-lg font-semibold text-app-green">Filters</h3>
            <button onClick={() => setMobileFitersOpen(false)} className="p-2 hover:bg-app-cream rounded-lg">
              <XIcon className="size-5"/>
            </button>
          </div>

          <div className="p-4">
            <FilterPanel 
            categories={categoriesData}
            category={category}
            organic={organic}
            minPrice={minPrice}
            maxPrice={maxPrice}
            updateFilter={updateFilter}
            clearFilters={clearFilters}
            hasFilters={hasFilters}
            />
          </div>
         </div>
        </>
       )}
      </div>
    )
}


export default Products;