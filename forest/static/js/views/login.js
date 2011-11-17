PANDA.views.Login = Backbone.View.extend({
    el: $("#content"),
    
    template: PANDA.templates.login,

    events: {
        "submit #login-form":   "login"
    },

    initialize: function() {
        _.bindAll(this, "render");
    },

    reset: function() {
        this.render();
    },

    render: function() {
        email = $.cookie("email");

        this.el.html(this.template({ email: email }));
    },

    validate: function() {
        var data = $("#login-form").serializeObject();
        var errors = {};

        if (!data["email"]) {
            errors["email"] = ["Please enter your email."];
        }

        if (!data["password"]) {
            errors["password"] = ["Please enter your password."];
        }

        return errors;
    },

    login: function() {
        var errors = this.validate();

        if (!_.isEmpty(errors)) {
            $("#login-form").show_errors(errors, "Login failed!");
        
            return false;
        }

        $.ajax({
            url: '/login/',
            dataType: 'json',
            type: 'POST',
            data: $("#login-form").serialize(),
            success: function(data, status, xhr) {
                Redd.set_current_user(new PANDA.models.User(data));
                Redd.goto_search();
            },
            error: function(xhr, status, error) {
                Redd.set_current_user(null); 

                try {
                    errors = $.parseJSON(xhr.responseText);
                } catch(e) {
                    errors = { "__all__": "Unknown error" }; 
                }

                $("#login-form").show_errors(errors, "Login failed!");
            }
        });

        return false;
    },
});


