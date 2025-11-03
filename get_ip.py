#!/usr/bin/env python3
"""
Get your local IP address for network access to ParkEase
"""

import socket
import subprocess
import sys

def get_local_ip():
    """Get the local IP address"""
    try:
        # Connect to a remote address to find local IP
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception as e:
        print(f"❌ Error getting IP: {e}")
        return None

def get_hostname():
    """Get computer hostname"""
    try:
        return socket.gethostname()
    except:
        return "unknown"

def main():
    print("=" * 60)
    print("🌐 ParkEase Network Access Information")
    print("=" * 60)
    
    ip = get_local_ip()
    hostname = get_hostname()
    
    if ip:
        print(f"\n📍 Your IP Address: {ip}")
        print(f"🖥️  Computer Name: {hostname}")
        print(f"\n🌐 Server URL for other devices:")
        print(f"   http://{ip}:3000")
        print(f"\n📱 To access from other devices:")
        print(f"   1. Make sure your device and their device are on the SAME network")
        print(f"   2. They can access: http://{ip}:3000")
        print(f"   3. Or scan this QR code (if using mobile):")
        print(f"\n   QR Code URL: http://{ip}:3000/qr")
        print("\n⚠️  Important Security Notes:")
        print("   - Only share within your local network")
        print("   - Firewall may block connections (check Windows Firewall)")
        print("   - Make sure server is running on port 3000")
        print("=" * 60)
    else:
        print("❌ Could not determine your IP address")
        print("\n🔧 Alternative methods:")
        print("   • Open Command Prompt and run: ipconfig")
        print("   • Look for 'IPv4 Address' under your network adapter")
        print("   • Use that IP address with :3000 port")
        print("=" * 60)

if __name__ == "__main__":
    main()

