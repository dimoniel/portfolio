// JavaScript code
$( document ).ready( init );

// initializing the namespace
function init() {
	var App = {
		Models: {},
		Views: {},
		Collections: {}
	};

// template helper
	var template = function( id ) {
		return _.template( $("#" + id).html() );
	};

// Model constructor description 
	App.Models.Message = Backbone.Model.extend( {
		defaults: {
			userName: "Guest",
			date: ( new Date().toLocaleString("ru", 
													{
														day: 'numeric',
					  									month: 'long',
					  									year: 'numeric'
					  								}) 
					).slice(0, -3),
			message: ">>empty<<"
		},

		validate: function(attrs, options) {
			if ( !(/(^[A-Z]{1}[a-z]+$)|(^[А-Я]{1}[а-я]+$)/.test(attrs.userName)) ) {
				return "Name is not validate";
			}
			else if (!attrs.date) {
				return "Date is not exist";
			}
			else if ( (/(^$)|(^\n+$)/.test(attrs.message)) ) {
				return "Please, input a message";
			}

		},

		initialize: function() {
			this.on("invalid", 
					function(model, error) {
						console.log(error);						
					});
		}

	} );

// Collection description
	App.Collections.Messages = Backbone.Collection.extend( {
		model: App.Models.Message,

		initialize: function() {
			
		}
	} );

// Single View description
	App.Views.Message = Backbone.View.extend( {
		tagName: "ARTICLE",
		template: template("message-template"),

		initialize: function() {
			this.$el.addClass('article');
		},

		render: function() {
			var template = this.template( this.model.toJSON() );
			this.$el.html( template );
			return this;
		}
		
	} );

//Collection of Views description
	App.Views.Messages = Backbone.View.extend( {
		el: "#messageConatiner",

		initialize: function() {
			this.collection.on( "add", this.addOne, this );
		},

		render: function() {
			this.collection.each(this.addOne, this);
			return this;
		},

		addOne: function( message ) {
				var messView = new App.Views.Message( {model: message} );
				this.$el.append( messView.render().$el );
		}

	} );

//Addition Message view description
	App.Views.AddMessage = Backbone.View.extend( {
		el: "#messageForm",
		isCtrl: false,

		events: {
			"submit": "submit",
			"keyup": "unpressed",
			"keydown": "pressed"
		},

		initialize: function () {
			
		},

		submit: function( e ) {
			e.preventDefault();
			var newModel = new App.Models.Message();
			var modelDate = ( new Date().toLocaleString("ru", 
													{
														day: 'numeric',
					  									month: 'long',
					  									year: 'numeric'
					  								}) 
					).slice(0, -3);
			var modelMessage = this.$el.find("#newMessage").val();
			
			newModel.set( {"userName": isUser}, {validate: true} );
			newModel.set( {"date": modelDate}, {validate: true} );
			newModel.set( {"message": modelMessage}, {validate: true} );
			if (newModel.attributes.message === ">>empty<<") {
				newModel.destroy();
			} else {
				this.collection.add( newModel );
			}
			this.$el.find("#newMessage").val("");
		},

		unpressed: function(e) {
			if (e.which === 17) {
				this.isCtrl = false;
			}
		},

		pressed: function(e) {
			if(e.which === 17) {
				this.isCtrl = true;
			}
			if ( (e.which === 13) && this.isCtrl ) {
				this.$el.submit();
			}
		}

	} );

	var messCollection = new App.Collections.Messages( [
		{
			userName: "Самуил",
			date: ( new Date(2011, 9, 13).toLocaleString("ru", 
													{
														day: 'numeric',
					  									month: 'long',
					  									year: 'numeric'
					  								}) 
					).slice(0, -3),
			message: "Привет, Верунь! ниче себе ты крутая. фотка класс!!!!"
		},
		{
			userName: "Лилия Семёновна",
			date: ( new Date(2011, 9, 14).toLocaleString("ru", 
													{
														day: 'numeric',
					  									month: 'long',
					  									year: 'numeric'
					  								}) 
					).slice(0, -3),
			message: "Вероника, здравствуйте! Есть такой вопрос: Особый вид куниц жизненно стабилизирует кинетический момент, это и есть всемирно известный центр огранки алмазов и торговли бриллиантами?"
		},
		{
			userName: "Лилия Семёновна",
			date: ( new Date(2011, 9, 14).toLocaleString("ru", 
													{
														day: 'numeric',
					  									month: 'long',
					  									year: 'numeric'
					  								}) 
					).slice(0, -3),
			message: "Вероника, здравствуйте! Есть такой вопрос: Особый вид куниц жизненно стабилизирует кинетический момент?"
		}
	] );
	
	var messViews = new App.Views.Messages( {collection: messCollection} );
	messViews.render().$el;

	var newMessView = new App.Views.AddMessage( {collection: messCollection} ); 

	var isUser = prompt("Enter user name", "");	

};