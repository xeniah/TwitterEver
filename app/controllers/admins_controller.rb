class AdminsController < ApplicationController
  require 'evernote_config.rb'
  
  def index
    @admins = Admin.all
  end

  def show
    @admin = Admin.find(params[:id])
  end

  def login_to_evernote
      if session[:access_token].nil?
        redirect;
      else
        retrieve_user_info;
        render :welcome_page;
      end
    
    #render :text => 'login here'
  end
  
  def new
    @admin = Admin.new
  end

  def create
    @admin = Admin.new(params[:admin])
    if @admin.save
      redirect_to @admin, :notice => "Successfully created admin."
    else
      render :action => 'new'
    end
  end

  def edit
    @admin = Admin.find(params[:id])
  end

  def update
    @admin = Admin.find(params[:id])
    if @admin.update_attributes(params[:admin])
      redirect_to @admin, :notice  => "Successfully updated admin."
    else
      render :action => 'edit'
    end
  end

  def destroy
    @admin = Admin.find(params[:id])
    @admin.destroy
    redirect_to admins_url, :notice => "Successfully destroyed admin."
  end
  
  def logout
    reset;
    render :welcome_page;
  end
  
  # Evernote OAUTH
  def reset
    session[:request_token] = nil
    session[:access_token] = nil
    session[:oauth_verifier] = nil
    session[:shard_id] = nil
    session[:user] = nil
    session[:notebooks] = nil  
  end
  
  def redirect
      callback_url = request.url.chomp("login_to_evernote").chomp("requesttoken").concat("redirect_callback")
      puts "I am in redirect, callback url: #{callback_url}"
      begin
        consumer = OAuth::Consumer.new(OAUTH_CONSUMER_KEY, OAUTH_CONSUMER_SECRET,{
            :site => EVERNOTE_SERVER,
            :request_token_path => "/oauth",
            :access_token_path => "/oauth",
            :authorize_path => "/OAuth.action"})
        session[:request_token] = consumer.get_request_token(:oauth_callback => callback_url)
        @current_status = "Obtained temporary credentials"
        redirect_to session[:request_token].authorize_url
      rescue Exception => e
        @last_error = "Error obtaining temporary credentials: #{e.message}"
      end
  end
  
  def redirect_callback
    puts "I am in callback"
    if (params['oauth_verifier'].nil?)
      #TODO: what do we do? 
      @last_error = "Content owner did not authorize the temporary credentials"
    else
      session[:oauth_verifier] = params['oauth_verifier']
      @current_status = "Content owner authorized the temporary credentials"
    end
    
    puts @current_status
    
    if (session[:request_token].nil? == false)
       begin
         session[:access_token] = session[:request_token].get_access_token(:oauth_verifier => session[:oauth_verifier])

         # The response from the server will include the user's shardId,
         # which we will need later need to use the API
         session[:shard_id] = session[:access_token].params['edam_shard'];
         session[:user] = retrieve_user_info; 
         puts "USERNAME: #{session[:user].username}"
         @current_status = "Exchanged the authorized temporary credentials for token credentials"
         puts @current_status
       rescue Exception => e
         @last_error = "Failed to obtain token credentials: #{e.message}"  
         puts @last_error;    
       end
    end
   # session[:user] = retrieve_user_info;
    retrieve_notebooks;
    render :welcome_page;
  end
  
  
  def retrieve_notebooks 
    noteStoreUrl = NOTESTORE_URL_BASE + session[:shard_id]
    noteStoreTransport = Thrift::HTTPClientTransport.new(noteStoreUrl)
    noteStoreProtocol = Thrift::BinaryProtocol.new(noteStoreTransport)    
    noteStore = Evernote::EDAM::NoteStore::NoteStore::Client.new(noteStoreProtocol)
      
    begin
      # All NoteStore API calls require you to pass the OAuth token credentials 
      # (aka access token) as the auth token
      notebooks = noteStore.listNotebooks(session[:access_token].token)
      result = Array.new
      notebooks.each do |notebook| 
        result << notebook.name
        puts "Notebook name: #{notebook.name}"
      end
      session[:notebooks] = result
      @current_status = "Successfully listed content owner's notebooks"
    rescue Exception => e
      @last_error = "Error listing notebooks: #{e.message}"      
    end
    puts @current_status
  end
   
  
  def retrieve_user_info
    puts "SESSION ACCESS TOKEN: #{session[:access_token]}"
    puts "Retrieving user creds"
    userStoreUrl = "https://sandbox.evernote.com/edam/user";
    userStoreTransport = Thrift::HTTPClientTransport.new(userStoreUrl)
    userStoreProtocol = Thrift::BinaryProtocol.new(userStoreTransport)
    userStore = Evernote::EDAM::UserStore::UserStore::Client.new(userStoreProtocol)
    
    authToken = session[:access_token].token;
    user = userStore.getUser(authToken);
    puts "Examining user #{user.username}:";
    user;
  end
  
  
end
