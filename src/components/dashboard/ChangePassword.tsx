
import { useState } from 'react';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';
import CustomButton from '../ui/custom-button';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordMatch, setPasswordMatch] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'newPassword') {
      // Calculate password strength
      let strength = 0;
      if (value.length >= 8) strength += 1;
      if (/[A-Z]/.test(value)) strength += 1;
      if (/[0-9]/.test(value)) strength += 1;
      if (/[^A-Za-z0-9]/.test(value)) strength += 1;
      setPasswordStrength(strength);
    }
    
    if (name === 'confirmPassword' || name === 'newPassword') {
      // Check if passwords match
      const newPassword = name === 'newPassword' ? value : formData.newPassword;
      const confirmValue = name === 'confirmPassword' ? value : formData.confirmPassword;
      setPasswordMatch(confirmValue === '' || newPassword === confirmValue);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setPasswordMatch(false);
      return;
    }
    
    console.log('Password change submitted');
    alert('Password changed successfully!');
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordStrength(0);
  };

  const getPasswordStrengthColor = () => {
    switch(passwordStrength) {
      case 0: return 'bg-red-500';
      case 1: return 'bg-red-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-green-400';
      case 4: return 'bg-green-600';
      default: return 'bg-red-500';
    }
  };

  const getPasswordStrengthText = () => {
    switch(passwordStrength) {
      case 0: return 'Very Weak';
      case 1: return 'Weak';
      case 2: return 'Medium';
      case 3: return 'Strong';
      case 4: return 'Very Strong';
      default: return 'Very Weak';
    }
  };

  return (
    <div className="animate-scale-in">
      <h1 className="content-title">Change Password</h1>
      
      <div className="dashboard-card max-w-md mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="currentPassword" className="form-label">Current Password</label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="form-input pr-10"
                placeholder="Enter current password"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="newPassword" className="form-label">New Password</label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="form-input pr-10"
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            
            {formData.newPassword && (
              <div className="mt-2">
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Password Strength:</span>
                  <span className="text-xs font-medium">{getPasswordStrengthText()}</span>
                </div>
                <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getPasswordStrengthColor()} transition-all duration-300`}
                    style={{ width: `${(passwordStrength / 4) * 100}%` }}
                  ></div>
                </div>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center text-xs">
                    <div className={`h-3 w-3 rounded-full mr-2 ${formData.newPassword.length >= 8 ? 'bg-green-500' : 'bg-muted'}`}></div>
                    <span>At least 8 characters</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <div className={`h-3 w-3 rounded-full mr-2 ${/[A-Z]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-muted'}`}></div>
                    <span>At least one uppercase letter</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <div className={`h-3 w-3 rounded-full mr-2 ${/[0-9]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-muted'}`}></div>
                    <span>At least one number</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <div className={`h-3 w-3 rounded-full mr-2 ${/[^A-Za-z0-9]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-muted'}`}></div>
                    <span>At least one special character</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`form-input pr-10 ${!passwordMatch ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {formData.confirmPassword && passwordMatch && formData.newPassword === formData.confirmPassword && (
              <div className="mt-1 flex items-center text-green-600 text-sm">
                <CheckCircle className="h-4 w-4 mr-1" />
                <span>Passwords match</span>
              </div>
            )}
            {!passwordMatch && (
              <div className="mt-1 text-red-500 text-sm">
                Passwords do not match
              </div>
            )}
          </div>
          
          <div className="mt-6">
            <CustomButton 
              type="submit" 
              disabled={!passwordMatch || formData.newPassword === '' || formData.confirmPassword === ''}
              className="w-full"
            >
              Change Password
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
