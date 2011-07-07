class LoginsController < ApplicationController
  layout nil
  def index
    @logins = Login.all
  end

  def show
    @login = Login.find(params[:id])
  end

  def new
    @login = Login.new
  end

  def create
    @login = Login.new(params[:login])
    if @login.save
      redirect_to @login, :notice => "Successfully created login."
    else
      render :action => 'new'
    end
  end

  def edit
    @login = Login.find(params[:id])
  end

  def update
    @login = Login.find(params[:id])
    if @login.update_attributes(params[:login])
      redirect_to @login, :notice  => "Successfully updated login."
    else
      render :action => 'edit'
    end
  end

  def destroy
    @login = Login.find(params[:id])
    @login.destroy
    redirect_to logins_url, :notice => "Successfully destroyed login."
  end
end
