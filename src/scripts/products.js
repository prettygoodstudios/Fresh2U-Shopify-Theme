class ProductGrid extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      type: this.props.type,
      products: [],
      isLoading: true,
      query: ""
    }
    this.updateSearch = this.updateSearch.bind(this);
  }
  componentDidMount(){
    $.get("/admin/products.json").then((data) => {
      console.log(data.products);
      var query = this.getParameterByName("q");
      this.setState({
        products: data.products,
        isLoading: false,
        query: query
      });
    });
  }
  getParameterByName(name, url) {
      if (!url) url = window.location.href;
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
          results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
  }
  addToCart(id){
    console.log(id);
    $.post("/cart/add.js",{id: id,quantity: 1}).then(function(data){
      console.log("cart",data);
    });
  }
  updateSearch(event){
    const target = event.target;
    const q = target.value;
    this.setState({
      query: target.value
    });

  }
  render(){
    let filtered = this.state.products.filter(
      (product) => {
        return product.title.toLowerCase().indexOf(this.state.query.toLowerCase()) !== -1 || product.body_html.toLowerCase().indexOf(this.state.query.toLowerCase()) !== -1 || product.vendor.toLowerCase().indexOf(this.state.query.toLowerCase()) !== -1;
      }
    );
    let final = this.state.products;
    if(this.state.query != "") final = filtered;
    const productList = final.map((product,i) =>
      <Product imgUrl={product.image.src} title={product.title} productID={product.id} variantID={product.variants[0].id} variantTitle={product.variants[0].title} bodyHTML={product.body_html} url={"https://fresh-2u.myshopify.com/products/"+product.handle} price={product.variants[0].price} click={this.addToCart}/>
    );
    return(
      <div>
        {this.state.type == "search" && <SearchForm query={this.state.query} change={this.updateSearch} />}
        <div className="row">
          {!this.state.isLoading && productList}
          {this.state.isLoading && <center><div className="loader"></div></center>}
        </div>
      </div>
    );
  }
}
const Product = (props) => {
  return(
    <div className="four columns card">
      <div className="img-holder"><img src={props.imgUrl} alt={props.title} /></div>
      <div className="card-info">
        <div className="card-title">{props.title}</div>
        <div className="card-price">${props.price}</div>
        <div className="card-review">
          <div className="yotpo bottomLine" data-appkey="fbmH9DfgEkBOedaUXJPqVXkjETHSVPEnANuHcFc9" data-domain="fresh-2u.myshopify.com" data-product-id={props.productID} data-product-models={props.productID} data-name={props.title} data-url={props.url} data-image-url={props.imgUrl} data-description={props.bodyHTML} >
          </div>
        </div>
      </div>
      <div className="card-overlay">
        <form className="" action="/cart/add" data-productid={props.productID} method="post">
          <input name="id" data-productid={props.productID} className="product-select" value={props.variantID} data-variant-title={props.variantTitle} type="hidden" />
          <input type="submit" className="overlay-button" value="Add to Cart" />
          <a href={props.url} className="overlay-button">More Info</a>
        </form>
      </div>
    </div>
  );
}
const SearchForm = (props) => {
  return(
    <div className="search-form">
      <center><input type="text" placeholder="Search Our Store!" value={props.query} onChange={props.change} /></center>
      <center>{props.query != "" &&<p>Your search for {props.query} yielded:</p>}</center>
    </div>
  );
}
ReactDOM.render(<ProductGrid type={"search"}/>,document.getElementById("productParent"));
