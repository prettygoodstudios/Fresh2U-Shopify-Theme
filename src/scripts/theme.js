window.slate = window.slate || {};
window.theme = window.theme || {};

/*================ Slate ================*/
// =require slate/a11y.js
// =require slate/cart.js
// =require slate/utils.js
// =require slate/rte.js
// =require slate/sections.js
// =require slate/currency.js
// =require slate/images.js
// =require slate/variants.js

/*================ Sections ================*/
// =require sections/product.js

/*================ Templates ================*/
// =require templates/customers-addresses.js
// =require templates/customers-login.js

$(document).ready(function() {
  loadScript();
  var sections = new slate.Sections();
  sections.register('product', theme.Product);

  // Common a11y fixes
  slate.a11y.pageLinkFocus($(window.location.hash));

  $('.in-page-link').on('click', function(evt) {
    slate.a11y.pageLinkFocus($(evt.currentTarget.hash));
  });

  // Target tables to make them scrollable
  var tableSelectors = '.rte table';

  slate.rte.wrapTable({
    $tables: $(tableSelectors),
    tableWrapperClass: 'rte__table-wrapper',
  });

  // Target iframes to make them responsive
  var iframeSelectors =
    '.rte iframe[src*="youtube.com/embed"],' +
    '.rte iframe[src*="player.vimeo"]';

  slate.rte.wrapIframe({
    $iframes: $(iframeSelectors),
    iframeWrapperClass: 'rte__video-wrapper'
  });

  // Apply a specific class to the html element for browser support of cookies.
  if (slate.cart.cookiesEnabled()) {
    document.documentElement.className = document.documentElement.className.replace('supports-no-cookies', 'supports-cookies');
  }
});
var loadScript = function(url, callback){
  if ((typeof jQuery === 'undefined') || (parseFloat(jQuery.fn.jquery) < 1.7)) {
    loadScript('//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js', function(){
      jQuery191 = jQuery.noConflict(true);
      myAppJavaScript(jQuery191);
    });
  } else {
    myAppJavaScript(jQuery);
  }
};
var show = false;
var myAppJavaScript = function($){
  /* Your app's JavaScript here.
     $ in this scope references the jQuery object we'll use.
     Don't use 'jQuery', or 'jQuery191', here. Use the dollar sign
     that was passed as argument.*/
   $(".toggle").click(function(){
     if (show){
       show = false;
     }else{
       show = true;
     }
     $(".nav-right").toggle();
     $(".site-nav").toggle();
     $(".site-nav li a").css("display","block");
     $(".nav-right").css("float","none");
     $(".toggle").toggleClass("change");
   });
   $("#cart-form input").change(function(){
     $("#finish-check-out").hide();
     $("#please-update").show();
   });
   var zipCodes = [84097,84057,84058,84059,84601,84602,84603,84604,84605,84606,84663,84042,84062];
   $("#cart-form").submit(function(e){
     var notFound = true;
     for(var i=0; i < zipCodes.length; i++){
       if (zipCodes[i] == parseInt($( "#zip" ).val(), 10)){
         notFound = false;
       }
     }
     if(notFound && $( "#zip" ).val() != ""){
       e.preventDefault();
       alert("Sorry, you are outside of our delivery area!");
     }else if($( "#zip" ).val() == ""){
       e.preventDefault();
       alert("You must enter in a zip code to insure you live within our deliver area.");
     }
   });
   $('<div class="quantity-nav"><div class="quantity-button quantity-up">+</div><div class="quantity-button quantity-down">-</div></div>').insertAfter('.quantity input');
    $('.quantity').each(function() {
      var spinner = $(this),
        input = spinner.find('input[type="number"]'),
        btnUp = spinner.find('.quantity-up'),
        btnDown = spinner.find('.quantity-down'),
        min = input.attr('min'),
        max = input.attr('max');

      btnUp.click(function() {
        var oldValue = parseFloat(input.val());
        if (oldValue >= max) {
          var newVal = oldValue;
        } else {
          var newVal = oldValue + 1;
        }
        spinner.find("input").val(newVal);
        spinner.find("input").trigger("change");
      });

      btnDown.click(function() {
        var oldValue = parseFloat(input.val());
        if (oldValue <= min) {
          var newVal = oldValue;
        } else {
          var newVal = oldValue - 1;
        }
        spinner.find("input").val(newVal);
        spinner.find("input").trigger("change");
      });
   });
   $("#zip").keypress(function(e){
     if(e.which == 13){
       $("#cart-form").submit();
     }
   });
   var slideNumber = 1;
   $(".carousel li").css("display","block");
   var maxHeight = 0
   for(var i = 1; i < $(".carousel li").length; i++){
     if(parseInt($(".carousel li:nth-child("+slideNumber+") img").css("height").split("p")[0]) > 0){
       maxHeight = $(".carousel li:nth-child("+slideNumber+") img").css("height");
     }
   }
   $(".carousel li").css("display","none");
   $(".carousel li:nth-child("+slideNumber+")").css("display","block");
   $(".prev").click(function(){
     if(slideNumber == 1){
       slideNumber = $(".carousel li").length;
     }else{
       slideNumber--;
     }
     $(".carousel li").css("display","none");
     $(".carousel li:nth-child("+slideNumber+")").css("display","block");
     $(".carousel li:nth-child("+slideNumber+")").css("display","block");
     $(".carousel li:nth-child("+slideNumber+")").css("height",maxHeight);
   });
   $(".next").click(function(){
     if(slideNumber == $(".carousel li").length){
       slideNumber = 1
     }else{
       slideNumber++;
     }
     $(".carousel li").css("display","none")
     $(".carousel li:nth-child("+slideNumber+")").css("display","block");
     $(".carousel li:nth-child("+slideNumber+")").css("height",maxHeight);
   });
   $(".carousel li").css("display","none");
   $(".carousel li:nth-child("+slideNumber+")").css("display","block");
   var tallestImage = 0;
   for(var i = 1; i < $(".grid .card").length; i++){
     if(parseInt($(".grid card:nth-child("+i+") img").css("height").split("p")[0]) > parseInt(tallestImage.split("p")[0])){
       tallestImage = $(".grid .card:nth-child("+i+") img").height();
     }
   }
   $(".grid card img").css("height",tallestImage);
   $(window).resize(function(){
     if(window.innerWidth > 820){
       $(".toggle").removeClass("change");
       $(".site-nav").css("display","inline");
       $(".site-nav li a").css("display","inline");
       $(".nav-right").css("display","inline");
       show = false;
     }else{
       if(show){
         $(".site-nav").css("display","block !important");
         $(".site-nav li a").css("display","block !important");
         $(".nav-right").css("display","block !important");
       }else{
          $(".site-nav").hide();
          $(".nav-right").hide();
       }
     }
     for(var i = 1; i < $(".carousel li").length; i++){
       if(parseInt($(".carousel li:nth-child("+slideNumber+") img").css("height").split("p")[0]) > 0){
         maxHeight = $(".carousel li:nth-child("+slideNumber+") img").css("height");
       }
     }
     $(".carousel li").css("display","none");
     $(".carousel li:nth-child("+slideNumber+")").css("display","block");
   });
   var otherShow = true;
   $("#other").change(function(){
     if(otherShow){
       otherShow = false;
       $(".other").removeClass("card");
       $(".other").hide();
       showCards();
     }else{
       otherShow = true;
       $(".other").show();
       $(".other").addClass("card");
     }
   });
   var glutenShow = true;
   $("#gluten-free").change(function(){
     if(glutenShow){
       glutenShow = false;
       $(".gluten-free").removeClass("card");
       $(".gluten-free").hide();
       showCards();
     }else{
       glutenShow = true;
       $(".gluten-free").show();
       $(".gluten-free").addClass("card");
     }
   });
   var veganShow = true;
   $("#vegan").change(function(){
     if(veganShow){
       veganShow = false;
       $(".vegan").hide();
       $(".vegan").removeClass("card");
       showCards();
     }else{
       veganShow = true;
       $(".vegan").show();
       $(".vegan").addClass("card");
     }
   });
   var vegetarianShow = true;
   $("#vegetarian").change(function(){
     if(vegetarianShow){
       vegetarianShow = false;
       $(".vegetarian").removeClass("card");
       $(".vegetarian").hide();
       showCards();
     }else{
       vegetarianShow = true;
       $(".vegetarian").show();
       $(".vegetarian").addClass("card");
     }
   });
   var sweetsShow = true;
   $("#sweets").change(function(){
     if(sweetsShow){
       sweetsShow = false;
       $(".sweets").removeClass("card");
       $(".sweets").hide();
       showCards();
     }else{
       sweetsShow = true;
       $(".sweets").show();
       $(".sweets").addClass("card");
     }
   });
   var featuredShow = true;
   $("#featured").change(function(){
     if(featuredShow){
       featuredShow = false;
       $(".featured").hide();
       $(".featured").removeClass("card");
       showCards();
     }else{
       featuredShow = true;
       $(".featured").show();
       $(".featured").addClass("card");
     }
   });
   var location = window.location.href;
   if(location.split("/")[3] == "collections"){
     veganShow = false;
     vegetarianShow = false;
     otherShow = false;
     glutenShow = false;
     featuredShow = false;
     sweetsShow = false;
     if(location.split("/")[4] == "vegan"){
       veganShow = true;
     }else if(location.split("/")[4] == "vegetarian"){
       vegetarianShow = true;
     }else if(location.split("/")[4] == "other"){
       otherShow = true;
     }else if(location.split("/")[4] == "gluten-free"){
       glutenShow = true;
     }
     else if(location.split("/")[4] == "featured"){
       featuredShow = true;
     }else if(location.split("/")[4] == "sweets"){
       sweetsShow = true;
     }else{
       veganShow = true;
       vegetarianShow = true;
       otherShow = true;
       glutenShow = true;
       featuredShow = true;
       sweetsShow = true;
     }
     hideCards();
     showCards();
   }
   function showCards(){
     if(veganShow){
       $(".vegan").addClass("card");
       $(".vegan").show();
     }
     if(otherShow){
       $(".other").addClass("card");
       $(".other").show();
     }
     if(glutenShow){
       $(".gluten-free").addClass("card");
       $(".gluten-free").show();
     }
     if(featuredShow){
       $(".featured").addClass("card");
       $(".featured").show();
     }
     if(sweetsShow){
       $(".sweets").addClass("card");
       $(".sweets").show();
     }
     if(vegetarianShow){
       $(".vegetarian").addClass("card");
       $(".vegetarian").show();
     }
   }
   function hideCards(){
     if(!veganShow){
       $(".vegan").hide();
       $(".vegan").removeClass("card");
       $("#vegan").prop('checked', false);
     }
     if(!otherShow){
       $(".other").hide();
       $(".other").removeClass("card");
       $("#other").prop('checked', false);
     }
     if(!glutenShow){
       $(".gluten-free").hide();
       $(".gluten-free").removeClass("card");
       $("#gluten-free").prop('checked', false);
     }
     if(!featuredShow){
       $(".featured").hide();
       $(".featured").removeClass("card");
       $("#featured").prop('checked', false);
     }
     if(!sweetsShow){
       $(".sweets").hide();
       $(".sweets").removeClass("card");
       $("#sweets").prop('checked', false);
     }
     if(!vegetarianShow){
       $(".vegetarian").hide();
       $(".vegetarian").removeClass("card");
       $("#vegetarian").prop('checked', false);
     }
   }
};
