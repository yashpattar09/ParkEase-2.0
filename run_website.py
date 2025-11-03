#!/usr/bin/env python3
"""
ParkEase Website Launcher
This script starts the Node.js backend server and opens the website in your browser.
"""

import subprocess
import time
import webbrowser
import os
import sys
import signal
from pathlib import Path

def check_node_installed():
    """Check if Node.js is installed"""
    try:
        result = subprocess.run(['node', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ Node.js is installed: {result.stdout.strip()}")
            return True
        else:
            print("❌ Node.js is not installed or not in PATH")
            return False
    except FileNotFoundError:
        print("❌ Node.js is not installed or not in PATH")
        return False

def check_dependencies():
    """Check if backend dependencies are installed"""
    backend_path = Path(__file__).parent / "backend"
    node_modules = backend_path / "node_modules"
    
    if node_modules.exists():
        print("✅ Backend dependencies are installed")
        return True
    else:
        print("❌ Backend dependencies not found. Installing...")
        try:
            subprocess.run(['npm', 'install'], cwd=backend_path, check=True)
            print("✅ Dependencies installed successfully")
            return True
        except subprocess.CalledProcessError:
            print("❌ Failed to install dependencies")
            return False

def start_server():
    """Start the Node.js server"""
    backend_path = Path(__file__).parent / "backend"
    server_script = backend_path / "server.js"
    
    if not server_script.exists():
        print(f"❌ Server script not found at {server_script}")
        return None
    
    print("🚀 Starting ParkEase server...")
    try:
        # Start the server process
        process = subprocess.Popen(
            ['node', 'server.js'],
            cwd=backend_path,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            encoding='utf-8',
            errors='replace'
        )
        
        # Wait a moment for server to start
        time.sleep(3)
        
        # Check if server is running
        if process.poll() is None:
            print("✅ Server started successfully!")
            return process
        else:
            stdout, stderr = process.communicate()
            print(f"❌ Server failed to start:")
            print(f"STDOUT: {stdout}")
            print(f"STDERR: {stderr}")
            return None
            
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        return None

def check_server_running():
    """Check if server is responding"""
    import urllib.request
    import urllib.error
    
    try:
        response = urllib.request.urlopen('http://localhost:3000', timeout=5)
        if response.getcode() == 200:
            print("✅ Server is responding on http://localhost:3000")
            return True
    except (urllib.error.URLError, ConnectionRefusedError):
        pass
    
    print("❌ Server is not responding")
    return False

def open_browser():
    """Open the website in the default browser"""
    url = "http://localhost:3000"
    print(f"🌐 Opening {url} in your browser...")
    webbrowser.open(url)
    print("✅ Browser opened!")

def cleanup(process):
    """Clean up the server process"""
    if process and process.poll() is None:
        print("\n🛑 Stopping server...")
        process.terminate()
        try:
            process.wait(timeout=5)
            print("✅ Server stopped")
        except subprocess.TimeoutExpired:
            print("⚠️  Force killing server...")
            process.kill()
            process.wait()

def signal_handler(signum, frame):
    """Handle Ctrl+C gracefully"""
    print("\n\n🛑 Received interrupt signal. Shutting down...")
    sys.exit(0)

def main():
    """Main function to run the website"""
    print("=" * 60)
    print("🎯 ParkEase Website Launcher")
    print("=" * 60)
    
    # Set up signal handler for graceful shutdown
    signal.signal(signal.SIGINT, signal_handler)
    
    # Check prerequisites
    print("\n📋 Checking prerequisites...")
    if not check_node_installed():
        print("\n❌ Please install Node.js from https://nodejs.org/")
        return
    
    if not check_dependencies():
        print("\n❌ Failed to install dependencies")
        return
    
    # Start server
    print("\n🚀 Starting server...")
    server_process = start_server()
    if not server_process:
        print("\n❌ Failed to start server")
        return
    
    # Wait for server to be ready
    print("\n⏳ Waiting for server to be ready...")
    max_attempts = 10
    for attempt in range(max_attempts):
        if check_server_running():
            break
        if attempt < max_attempts - 1:
            print(f"   Attempt {attempt + 1}/{max_attempts}...")
            time.sleep(2)
        else:
            print("\n❌ Server failed to start properly")
            cleanup(server_process)
            return
    
    # Open browser
    print("\n🌐 Opening website...")
    open_browser()
    
    # Display success message
    print("\n" + "=" * 60)
    print("🎉 ParkEase is now running!")
    print("=" * 60)
    print("📍 Website: http://localhost:3000")
    print("🛑 Press Ctrl+C to stop the server")
    print("=" * 60)
    
    try:
        # Keep the script running and show server output
        print("\n📊 Server output:")
        print("-" * 40)
        while True:
            output = server_process.stdout.readline()
            if output:
                print(output.strip())
            elif server_process.poll() is not None:
                print("❌ Server stopped unexpectedly")
                break
            time.sleep(0.1)
    except KeyboardInterrupt:
        pass
    finally:
        cleanup(server_process)
        print("\n👋 Goodbye!")

if __name__ == "__main__":
    main()
