require 'test_helper'

class LoginTest < ActiveSupport::TestCase
  def test_should_be_valid
    assert Login.new.valid?
  end
end
