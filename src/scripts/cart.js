class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      showCart: false,
      cart: {
        items: [],
        numberOfItems: 0,
        total: 0
      }
    }
    this.toggleCart = this.toggleCart.bind(this);
    this.getCartData = this.getCartData.bind(this);
    this.updateCartData = this.updateCartData.bind(this);
  }
  toggleCart(){
    if(this.state.showCart){
      this.setState({
        showCart: false
      });
    }else{
      this.setState({
        showCart: true
      });
    }
    this.getCartData();
  }
  componentDidMount(){
    this.getCartData();
    document.getElementById("temporaryHeader").style.display = "none";
  }
  getCartData(){
    $.getJSON("/cart.js").then((data) => {
      console.log(data);
      var cart = {
        items: data.items,
        total: (data.total_price/100).toFixed(2),
        numberOfItems: data.item_count
      };
      this.setState({
        cart: cart
      });
    });
  }
  updateCartData(delta, index){
    var items = this.state.cart.items;
    if(items[index].quantity + delta >= 0){
      items[index].quantity = items[index].quantity + delta;
      var total = this.state.cart.total*100 + items[index].price * delta;
      total = (total/100).toFixed(2);
      var itemsNum = this.state.cart.numberOfItems + delta;
      var cart = {
        items: items,
        total: total,
        numberOfItems: itemsNum
      };
      this.setState({
        cart: cart
      });
      $.post("/cart/change.js",{ quantity: items[index].quantity, id: items[index].id});
    }
  }
  render(){
    return(
      <div>
        <Header cartItems={this.state.cart.numberOfItems} toggleCart={this.toggleCart}/>
        {this.state.showCart && <Cart showCart={this.state.showCart} app={this} toggleCart={this.toggleCart}/> }
      </div>
    );
  }
}
class Header extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      mobileNav: false,
      desktop: true,
      toggleClass: "",
      siteNav: { display: ""},
      navLinks: { display: ""},
      rightNav: { display: ""}
    }
    this.toggleMobileNav = this.toggleMobileNav.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
    this.getPageData = this.getPageData.bind(this);
  }
  componentDidMount(){
    this.getPageData();
    if(!(window.innerWidth > 820)){
      console.log("hello");
      var tempNav = {
        display: "none"
      }
      var rightNav = {
        display: "none"
      }
      this.setState({
        desktop: false,
        mobileNav: false,
        siteNav: tempNav,
        rightNav: rightNav
      });
    }
    window.onresize = this.updateDimensions();
  }
  getPageData(){
    $.get("/admin/pages.json").then((data) => {
      console.log("Pages",data);
    });
  }
  toggleMobileNav(){
    console.log("toggling");
    if(this.state.mobileNav){
      var tempNav = {
        display: "none"
      }
      var rightNav = {
        display: "none",
        float: "none"
      }
      this.setState({
        mobileNav: false,
        toggleClass: "",
        siteNav: tempNav,
        rightNav: rightNav
      });
    }else{
      console.log("showing");
      var tempNav = {
        display: "block"
      }
      var rightNav = {
        display: "block",
        float: "none",
        marginTop: "10px !important"
      }
      var navLinks = {
        display: "block",
        marginTop: 10,
        marginBottom: 10
      }
      this.setState({
        mobileNav: true,
        toggleClass: "change",
        siteNav: tempNav,
        rightNav: rightNav,
        navLinks: navLinks
      });
    }
  }
  updateDimensions() {
    console.log("Getting Called");
    if(window.innerWidth > 820) {
      console.log("nonMobile");
      var tempNav = {
        display: "inline"
      }
      var rightNav = {
        display: "inline",
        float: "right"
      }
      var navLinks = {
        display: "inline",
        marginTop: "0px"
      }
      this.setState({
        mobileNav: false,
        desktop: true,
        siteNav: tempNav,
        rightNav: rightNav,
        navLinks: navLinks
      });
    } else {
      if(this.state.mobileNav){
        var tempNav = {
          display: "block"
        }
        var rightNav = {
          display: "block",
          float: "none"
        }
        var navLinks = {
          display: "block"
        }
        this.setState({
          mobileNav: true,
          desktop: false,
          siteNav: tempNav,
          rightNav: rightNav,
          navLinks: navLinks
        });
      }else{
        console.log(window.innerWidth);
        var tempNav = {
          display: "none"
        }
        var rightNav = {
          display: "none",
          float: "none"
        }
        this.setState({
          desktop: false,
          mobileNav: false,
          siteNav: tempNav,
          rightNav: rightNav
        });
      }
    }
  }
  render(){
    return(
      <div className="nav">
        <header role="banner" className="banner">
          <h1 style={{display:"inline"}}>
            <a href="/" itemprop="url" className="site-logo site-header__logo-image">
                <img src="//cdn.shopify.com/s/files/1/2654/9698/files/Name_Logo2_250x.png?v=1513726116" srcset="//cdn.shopify.com/s/files/1/2654/9698/files/Name_Logo2_250x.png?v=1513726116 1x, //cdn.shopify.com/s/files/1/2654/9698/files/Name_Logo2_250x@2x.png?v=1513726116 2x" alt="Fresh 2U" itemprop="logo" />
            </a>
          </h1>
          <button className={"toggle "+this.state.toggleClass} onClick={() => {this.toggleMobileNav()}}>
            <div className="bar1"></div>
            <div className="bar2"></div>
            <div className="bar3"></div>
          </button>
          <nav role="navigation" className="navigation">
            <ul className="site-nav" style={this.state.siteNav}>
                <li style={this.state.navLinks}>
                  <a href="/pages/about" className="" style={this.state.navLinks}>About</a>
                </li>
                <li style={this.state.navLinks}>
                  <a href="/collections/all" className="" style={this.state.navLinks}>Shop</a>
                </li>
                <li style={this.state.navLinks}>
                  <a href="/pages/contact" className="" style={this.state.navLinks}>Contact</a>
                </li>
            </ul>
          </nav>
          <div className="nav-right" id="nav-right" style={this.state.rightNav}>
            <form action="/search" method="get" role="search">
              <label for="Search" className="label-hidden">
                Search!
              </label>
              <input type="search"
                     name="q"
                     id="Search"
                     placeholder="Search our Store!" />
              <input type="hidden" value="product" name="type" />
              <button type="submit" className="btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" className="icon"><path fill="#444" d="M18.64 17.02l-5.31-5.31c.81-1.08 1.26-2.43 1.26-3.87C14.5 4.06 11.44 1 7.75 1S1 4.06 1 7.75s3.06 6.75 6.75 6.75c1.44 0 2.79-.45 3.87-1.26l5.31 5.31c.45.45 1.26.54 1.71.09.45-.36.45-1.17 0-1.62zM3.25 7.75c0-2.52 1.98-4.5 4.5-4.5s4.5 1.98 4.5 4.5-1.98 4.5-4.5 4.5-4.5-1.98-4.5-4.5z"/></svg>
                <span className="icon-fallback-text">Search!</span>
              </button>
            </form>
            <a href="#" className="cart" id="cart" onClick={() => {this.props.toggleCart() }}>
              <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="#444" d="M18.936 5.564c-.144-.175-.35-.207-.55-.207h-.003L6.774 4.286c-.272 0-.417.089-.491.18-.079.096-.16.263-.094.585l2.016 5.705c.163.407.642.673 1.068.673h8.401c.433 0 .854-.285.941-.725l.484-4.571c.045-.221-.015-.388-.163-.567z"/><path fill="#444" d="M17.107 12.5H7.659L4.98 4.117l-.362-1.059c-.138-.401-.292-.559-.695-.559H.924c-.411 0-.748.303-.748.714s.337.714.748.714h2.413l3.002 9.48c.126.38.295.52.942.52h9.825c.411 0 .748-.303.748-.714s-.336-.714-.748-.714zM10.424 16.23a1.498 1.498 0 1 1-2.997 0 1.498 1.498 0 0 1 2.997 0zM16.853 16.23a1.498 1.498 0 1 1-2.997 0 1.498 1.498 0 0 1 2.997 0z"/></svg>
              <span id="cartQty">Cart</span>
            </a>
          </div>
        </header>
      </div>
    );
  }
}
class Cart extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      items: [],
      total: 0,
      numberOfItems: 0,
      verified: false,
      zip: undefined
    }
    this.updateQuantity = this.updateQuantity.bind(this);
    this.checkZipCode = this.checkZipCode.bind(this);
    this.render = this.render.bind(this);
    this.outsideClick = this.outsideClick.bind(this);
  }
  componentDidMount(){
    $.getJSON("/cart.js").then((data) => {
      console.log(data);
      this.setState({
        items: data.items,
        total: (data.total_price/100).toFixed(2),
        numberOfItems: data.item_count
      });
    });
    document.addEventListener("mousedown",this.outsideClick,false);
  }
  outsideClick(e){
    if(this.props.app.state.showCart && !document.getElementById("cParent").contains(e.target)){
      this.props.toggleCart();
    }
  }
  updateQuantity(delta,index){
    var items = this.state.items;
    if(items[index].quantity + delta >= 0){
      items[index].quantity = items[index].quantity + delta;
      var total = this.state.total*100 + items[index].price * delta;
      total = (total/100).toFixed(2);
      var itemsNum = this.state.numberOfItems + delta;
      this.setState({
        items: items,
        total: total,
        numberOfItems: itemsNum
      });
      $.post("/cart/change.js",{ quantity: items[index].quantity, id: items[index].id});
      var cartIcon = document.getElementById("cartQty");
      cartIcon.innerHTML = itemsNum + " items";
    }
  }
  checkZipCode(event){
     const target = event.target;
     const zip = target.value;
     this.setState({
       zip: target.value
     });
     var zipCodes = [84097,84057,84058,84059,84601,84602,84603,84604,84605,84606,84663,84042,84062];
     for(var i = 0;i < zipCodes.length; i++){
       if(zip == zipCodes[i]){
         this.setState({
           verified: true
         });
       }
     }
  }
  render(){
    const itemList = this.props.app.state.cart.items.map((item,i) =>
      <Item key={item.id} title={item.title} price={item.price} quantity={item.quantity} updateQuantity={this.props.app.updateCartData} index={i}/>
    );
    return(
      <div className="cart-parent" id="cParent" style={{display: this.props.showCart ? 'block' : 'visible' }} >
        <div className="cart-header">
          <h1>Cart</h1>
          <a href="#" id="closeCart" className="close-cart" onClick={() => { this.props.toggleCart() }}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" class="icon"><path fill="#444" d="M15.89 14.696l-4.734-4.734 4.717-4.717c.4-.4.37-1.085-.03-1.485s-1.085-.43-1.485-.03L9.641 8.447 4.97 3.776c-.4-.4-1.085-.37-1.485.03s-.43 1.085-.03 1.485l4.671 4.671-4.688 4.688c-.4.4-.37 1.085.03 1.485s1.085.43 1.485.03l4.688-4.687 4.734 4.734c.4.4 1.085.37 1.485-.03s.43-1.085.03-1.485z"/></svg></a>
        </div>
        {itemList}
        <div className="cart-footer">
          <h3>Total: ${this.props.app.state.cart.total}</h3>
          <h3>Number of Items: {this.props.app.state.cart.numberOfItems}</h3>
          {this.props.app.state.cart.total >= 10 && !this.state.verified &&<ZipForm zip={this.state.zip} change={this.checkZipCode}/>}
          {this.props.app.state.cart.total < 10 && <h3>You must order $10 or more worth of products to checkout.</h3>}
          {this.props.app.state.cart.total >= 10 && this.state.verified && <form action="/cart" method="post"><input type="submit" className="standard-button" value="Check Out" name="checkout" data-omnisend-checked="true"/></form>}
        </div>
        <div style={{height: 100}}>
        </div>
      </div>
    );
  }
}
const Item = (props) => {
  return(
    <div className="cart-item">
      <h3>{props.title}</h3>
      <div className="quantity">
        <input type="number" id="Quantity" name="quantity" value={props.quantity} min="1"  />
        <div className="quantity-nav">
          <div className="quantity-button quantity-up" onClick={() => { props.updateQuantity(1,props.index) }}>+</div>
          <div className="quantity-button quantity-down" onClick={() => { props.updateQuantity(-1,props.index) }}>-</div>
        </div>
      </div>
      <p style={{textIndent: "0.5em"}}>  X  ${(props.price/100).toFixed(2)}</p>
    </div>
  );
}
const ZipForm = (props) => {
  return(
    <div className="zip-form">
      <h3>Do you Live in Our Delivery Area?</h3>
      <p>Enter in your Zip Code to see. If your Zip Code matches one found within our delivery area you will then have the option to check out.</p>
      <input type="number" placeholder="Zip Code" value={props.zip} onChange={props.change} />
    </div>
  );
}
ReactDOM.render( <App />, document.getElementById('headerParent'));
