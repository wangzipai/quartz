import { QuartzComponentConstructor, QuartzComponent } from "../../types"

interface PasswordProtectionOptions {
  password?: string
  cookieDuration?: number
}

function PasswordProtectionComponent(options?: PasswordProtectionOptions): QuartzComponent {
  const password = options?.password ?? "quartz123"
  const cookieDuration = options?.cookieDuration ?? 30
  
  return () => {
    return {
      css: `
        .password-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: var(--light);
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        
        .password-box {
          background-color: var(--lightgray);
          padding: 2rem;
          border-radius: 5px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          max-width: 400px;
          width: 90%;
        }
        
        .password-box h2 {
          margin-top: 0;
          color: var(--dark);
        }
        
        .password-input {
          width: 100%;
          padding: 0.5rem;
          margin: 1rem 0;
          border: 1px solid var(--gray);
          border-radius: 3px;
        }
        
        .password-button {
          background-color: var(--secondary);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 3px;
          cursor: pointer;
        }
        
        .password-button:hover {
          opacity: 0.9;
        }
        
        .password-error {
          color: #d9534f;
          margin-top: 0.5rem;
        }
        
        .hidden {
          display: none;
        }
      `,
      js: () => {
        return `
          document.addEventListener('DOMContentLoaded', function() {
            // Check if already authenticated
            const isAuth = document.cookie.split('; ').find(row => row.startsWith('quartz_auth='));
            
            if (isAuth) {
              return; // Already authenticated
            }
            
            // Create overlay
            const overlay = document.createElement('div');
            overlay.className = 'password-overlay';
            
            overlay.innerHTML = \`
              <div class="password-box">
                <h2>Password Protected</h2>
                <p>This site is password protected. Please enter the password to continue.</p>
                <input type="password" class="password-input" placeholder="Enter password" />
                <button class="password-button">Submit</button>
                <p class="password-error hidden">Incorrect password. Please try again.</p>
              </div>
            \`;
            
            document.body.appendChild(overlay);
            
            // Handle password submission
            const input = overlay.querySelector('.password-input');
            const button = overlay.querySelector('.password-button');
            const error = overlay.querySelector('.password-error');
            
            const checkPassword = () => {
              if (input.value === "${password}") {
                // Set authentication cookie
                const expiryDate = new Date();
                expiryDate.setDate(expiryDate.getDate() + ${cookieDuration});
                document.cookie = "quartz_auth=true; expires=" + expiryDate.toUTCString() + "; path=/";
                
                // Remove overlay
                overlay.remove();
              } else {
                error.classList.remove('hidden');
              }
            };
            
            button.addEventListener('click', checkPassword);
            input.addEventListener('keypress', (e) => {
              if (e.key === 'Enter') {
                checkPassword();
              }
            });
          });
        `;
      },
    }
  }
}

export default ((opts?: PasswordProtectionOptions) => PasswordProtectionComponent(opts)) satisfies QuartzComponentConstructor 