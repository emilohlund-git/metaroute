const supertest = require("supertest");
/* @ts-ignore */
global.supertest = supertest;
process.env.NODE_ENV = 'test';