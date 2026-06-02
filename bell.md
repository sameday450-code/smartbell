# Realtime School Bell SaaS System - Full Stack Production Specification

## Project Name

SmartBell SaaS – Realtime School Bell & Public Address Management System

## Overview

Build a production-ready multi-tenant SaaS web application that automates school bells and voice announcements in real time.

The system should automatically announce scheduled events through speakers connected to computers, smart TVs, PA systems, or mobile devices.

The platform must support multiple schools, allowing each school to manage its own timetable and announcements independently.

---

# Core Features

## Automated Voice Announcements

The system must automatically trigger announcements based on scheduled times.

### JHS Assembly

Time: 7:00 AM

Announcement:

"Attention please. It is Assembly Time. All JHS students should proceed to the assembly ground immediately."

Repeat 2 times.

---

### Primary Assembly

Time: 8:00 AM

Announcement:

"Attention please. It is Assembly Time. All Primary students should proceed to the assembly ground immediately."

Repeat 2 times.

---

### Break Time

Time: 10:30 AM

Announcement:

"Attention please. It is Break Time. All students should proceed for break."

Repeat 2 times.

---

### Break Over

Time: 11:00 AM

Announcement:

"Attention please. Break is over. All students should return to their classrooms immediately."

Repeat 2 times.

---

### Lunch Time

Time: 12:30 PM

Announcement:

"Attention please. It is Lunch Time. All students should get ready for lunch."

Repeat 2 times.

---

### Closing Time

Time: 2:00 PM

Announcement:

"Attention please. It is Closing Time. All students should prepare for departure and school buses."

Repeat 2 times.

---

# SaaS Requirements

## Multi-Tenant Architecture

Each school gets:

* Separate account
* Separate timetable
* Separate announcements
* Separate settings
* Separate subscription plan

Data isolation must be enforced.

---

# User Roles

## Super Admin

Controls entire SaaS platform.

Can:

* View all schools
* Suspend schools
* Activate schools
* Manage subscriptions
* View analytics
* Manage plans
* View system logs

---

## School Admin

Controls one school.

Can:

* Create schedules
* Edit schedules
* Delete schedules
* Upload custom audio
* Use text-to-speech
* Trigger emergency announcements
* Manage users
* View logs

---

## Staff User

Can:

* View schedules
* Trigger authorized announcements
* Monitor system status

---

# Real-Time Requirements

Use Socket.IO for real-time communication.

Features:

* Live bell status
* Live announcement status
* Live dashboard updates
* Live notifications
* Emergency alerts

All connected clients should instantly receive updates.

---

# Audio Engine

Support:

* Browser audio playback
* MP3 uploads
* WAV uploads
* Text-to-Speech

Recommended TTS:

* ElevenLabs
* Google Cloud TTS

Features:

* Volume control
* Repeat count
* Voice selection
* Playback testing

---

# Emergency Broadcast Module

Admin can click:

"Emergency Broadcast"

Examples:

* Fire Alert
* Security Alert
* Medical Emergency

Broadcast should instantly play across all connected devices.

---

# School Timetable Manager

Admin can:

* Create Bell Event
* Select Time
* Select Days
* Choose Announcement
* Choose Repeat Count
* Enable/Disable Event

Support:

* Monday-Friday
* Saturday
* Holidays
* Special Events

---

# Dashboard Analytics

Show:

* Today's announcements
* Active schools
* Audio status
* Online devices
* Monthly broadcasts
* Recent activities

Charts:

* Daily usage
* Weekly usage
* Monthly usage

---

# Device Management

Register devices such as:

* Classroom PC
* Office PC
* Smart TV
* Android Tablet

Features:

* Online/Offline status
* Last seen
* Device name
* Assigned location

---

# Notification System

Real-time notifications for:

* Failed announcement
* Device offline
* Bell triggered
* Emergency alert

---

# Backend Architecture

Technology:

Node.js
Express.js
PostgreSQL (Neon)
Socket.IO
JWT Authentication
Prisma ORM
Redis Queue
Node Cron

Folder Structure

backend/

src/

modules/
auth/
schools/
users/
devices/
announcements/
schedules/
analytics/
subscriptions/

services/
tts/
audio/
socket/

middlewares/

config/

utils/

prisma/

server.js

---

# Frontend Architecture

Technology:

React.js
Vite
TailwindCSS
Socket.IO Client
TanStack Query
React Router
React Hook Form
Zustand

Folder Structure

frontend/

src/

pages/
components/
layouts/
hooks/
services/
store/
routes/
utils/

---

# Database Design

Tables

users

* id
* name
* email
* password
* role
* school_id

schools

* id
* name
* logo
* subscription_plan

devices

* id
* school_id
* name
* location
* status

schedules

* id
* school_id
* title
* announcement_text
* scheduled_time
* repeat_count
* active

announcements

* id
* school_id
* schedule_id
* played_at

subscriptions

* id
* school_id
* plan
* status

activity_logs

* id
* school_id
* action
* created_at

---

# Security Requirements

Implement:

* JWT Access Token
* Refresh Token
* RBAC
* Rate Limiting
* Helmet
* CORS
* Input Validation
* Password Hashing (bcrypt)

---

# SaaS Subscription Plans

Starter

* 1 School
* 5 Devices

Professional

* 25 Devices
* Custom Announcements

Enterprise

* Unlimited Devices
* Emergency Broadcasts
* Advanced Analytics

---

# Deployment

Frontend:
Vercel

Backend:
Vercel Serverless Functions

Database:
Neon PostgreSQL

File Storage:
Cloudinary

Caching:
Redis

Monitoring:
Sentry

Analytics:
PostHog

---

# UI Design Requirements

Modern SaaS Design

Pages:

* Landing Page
* Login
* Register
* Forgot Password
* Dashboard
* Timetable Management
* Announcement Management
* Device Management
* Analytics
* Subscription Billing
* Settings

Theme:

* Professional Education SaaS
* Blue + White + Indigo
* Fully Responsive
* Dark Mode
* Mobile First

---

# Additional Enterprise Features

* Audit Logs
* Backup Scheduler
* School Branding
* Multi-Language Support
* SMS Notifications
* WhatsApp Alerts
* Email Alerts
* Offline Device Recovery
* Bell History
* Announcement History

Build using clean architecture, scalable modules, enterprise-grade security, reusable React components, API-first design, and production-ready coding standards suitable for thousands of schools running simultaneously.
