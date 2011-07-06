require 'test_helper'

class LoginsControllerTest < ActionController::TestCase
  def test_index
    get :index
    assert_template 'index'
  end

  def test_show
    get :show, :id => Login.first
    assert_template 'show'
  end

  def test_new
    get :new
    assert_template 'new'
  end

  def test_create_invalid
    Login.any_instance.stubs(:valid?).returns(false)
    post :create
    assert_template 'new'
  end

  def test_create_valid
    Login.any_instance.stubs(:valid?).returns(true)
    post :create
    assert_redirected_to login_url(assigns(:login))
  end

  def test_edit
    get :edit, :id => Login.first
    assert_template 'edit'
  end

  def test_update_invalid
    Login.any_instance.stubs(:valid?).returns(false)
    put :update, :id => Login.first
    assert_template 'edit'
  end

  def test_update_valid
    Login.any_instance.stubs(:valid?).returns(true)
    put :update, :id => Login.first
    assert_redirected_to login_url(assigns(:login))
  end

  def test_destroy
    login = Login.first
    delete :destroy, :id => login
    assert_redirected_to logins_url
    assert !Login.exists?(login.id)
  end
end
