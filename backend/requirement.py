import os
import sys
import subprocess
import shutil

# Color formatting for beautiful console output
class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

def print_step(msg):
    print(f"\n{Colors.BOLD}{Colors.OKBLUE}[*] {msg}{Colors.ENDC}")

def print_success(msg):
    print(f"{Colors.BOLD}{Colors.OKGREEN}[+] {msg}{Colors.ENDC}")

def print_warning(msg):
    print(f"{Colors.BOLD}{Colors.WARNING}[!] {msg}{Colors.ENDC}")

def print_error(msg):
    print(f"{Colors.BOLD}{Colors.FAIL}[-] {msg}{Colors.ENDC}")

def check_executable(cmd):
    """Check if an executable exists in the system PATH."""
    return shutil.which(cmd) is not None

def run_command(cmd_list, cwd=None):
    """Run a system command and handle errors."""
    try:
        process = subprocess.run(
            cmd_list,
            cwd=cwd,
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            shell=True
        )
        return True, process.stdout
    except subprocess.CalledProcessError as e:
        return False, e.stderr + "\n" + e.stdout

def create_env_file(filepath, content):
    """Create a default env file if it doesn't already exist."""
    if not os.path.exists(filepath):
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content.strip())
        print_success(f"Created template environment file: {os.path.basename(filepath)}")
    else:
        print_warning(f"File already exists (skipped): {os.path.basename(filepath)}")

def main():
    print(f"{Colors.HEADER}{Colors.BOLD}" + "="*60)
    print("      EngageOS Backend - Setup & Requirements Installer      ")
    print("="*60 + f"{Colors.ENDC}")

    # Step 1: Pre-requisites validation
    print_step("Validating Pre-requisites...")
    
    if not check_executable("node"):
        print_error("Node.js is not installed or not in system PATH! Please install Node.js (v18+) to run this project.")
        sys.exit(1)
    else:
        _, version = run_command(["node", "--version"])
        print_success(f"Node.js found: {version.strip()}")

    if not check_executable("npm"):
        print_error("npm is not installed! npm is required to install dependencies.")
        sys.exit(1)
    else:
        _, version = run_command(["npm", "--version"])
        print_success(f"npm found: v{version.strip()}")

    # Step 2: Set up Environment Files (.env)
    print_step("Creating Configuration Template Files (.env)...")
    
    root_env_content = """
# Server configuration
PORT=5000
BACKEND_URL=http://localhost:5000

# Database Connection (PostgreSQL)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/engage_os?schema=public"

# Redis Connection (Used for BullMQ job queue)
REDIS_URL="redis://localhost:6379"

# Channel Service URL
CHANNEL_SERVICE_URL="http://localhost:6000"

# Google Gemini API Key (Required for AI Agents)
GEMINI_API_KEY="your_google_gemini_api_key_here"

# JWT Secret for User Authentication
JWT_SECRET="super_secret_jwt_sign_key_123"

# SMTP Authentication Settings (For verification emails)
EMAIL_USER="your_email@gmail.com"
EMAIL_PASS="your_gmail_app_password"
"""
    
    channel_env_content = """
# Channel Service Server configuration
PORT=6000
BACKEND_URL=http://localhost:5000

# SMTP Authentication Settings (For campaign emails)
EMAIL_USER="your_email@gmail.com"
EMAIL_PASS="your_gmail_app_password"
"""

    create_env_file(".env", root_env_content)
    create_env_file(os.path.join("channel-service", ".env"), channel_env_content)

    # Step 3: Install Main Project NPM Dependencies
    print_step("Installing Main Project dependencies (root package.json)...")
    print("Running 'npm install' in project root, please wait...")
    success, output = run_command(["npm", "install"])
    if success:
        print_success("Main project dependencies installed successfully.")
    else:
        print_error(f"Failed to install main dependencies: {output}")
        sys.exit(1)

    # Step 4: Install Channel Service NPM Dependencies
    print_step("Installing Channel Service dependencies (channel-service package.json)...")
    print("Running 'npm install' in './channel-service' directory, please wait...")
    success, output = run_command(["npm", "install"], cwd="channel-service")
    if success:
        print_success("Channel Service dependencies installed successfully.")
    else:
        print_error(f"Failed to install channel-service dependencies: {output}")
        sys.exit(1)

    # Step 5: Prisma client generation
    print_step("Generating Prisma client...")
    print("Running 'npx prisma generate'...")
    success, output = run_command(["npx", "prisma", "generate"])
    if success:
        print_success("Prisma client generated successfully.")
    else:
        print_warning(f"Could not generate Prisma Client automatically: {output}")
        print_warning("Note: Make sure your DATABASE_URL in .env is correct, then run 'npx prisma db push' followed by 'npx prisma generate'.")

    # Final summary instructions
    print(f"\n{Colors.HEADER}{Colors.BOLD}" + "="*60)
    print("                     SETUP COMPLETED!                         ")
    print("="*60 + f"{Colors.ENDC}")
    print(f"\n{Colors.BOLD}Next Steps to run the application:{Colors.ENDC}")
    print(f"1. Make sure you have {Colors.OKCYAN}PostgreSQL{Colors.ENDC} and {Colors.OKCYAN}Redis{Colors.ENDC} running on your system.")
    print(f"2. Fill in the credentials in both {Colors.BOLD}.env{Colors.ENDC} and {Colors.BOLD}channel-service/.env{Colors.ENDC} files.")
    print(f"3. Run Database Migrations to initialize DB schema:")
    print(f"   {Colors.OKGREEN}npx prisma db push{Colors.ENDC}")
    print(f"4. Start the servers:")
    print(f"   - Main Server: {Colors.OKGREEN}npm start{Colors.ENDC}")
    print(f"   - Channel Service: {Colors.OKGREEN}npm --prefix channel-service run dev{Colors.ENDC}")
    print(f"   - Campaign Background Worker: {Colors.OKGREEN}npm run worker{Colors.ENDC}")
    print(f"   - Campaign Scheduler Worker: {Colors.OKGREEN}npm run scheduler{Colors.ENDC}")
    print("="*60)

if __name__ == "__main__":
    main()
