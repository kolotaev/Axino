# Test NGINX vs NodeJS http-proxy performance

Bare hello-service:
```
Running 1m test @ http://localhost:8080/gg
  12 threads and 400 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    24.48ms   12.32ms 195.80ms   75.40%
    Req/Sec   800.99    231.36     1.94k    65.15%
  574233 requests in 1.00m, 66.81MB read
  Socket errors: connect 157, read 279, write 0, timeout 0
Requests/sec:   9554.61
Transfer/sec:      1.11MB
```

NGINX reverse proxy for hello-service:
```
wrk -t12 -c400 -d1m http://localhost:7080/gg
Running 1m test @ http://localhost:7080/gg
  12 threads and 400 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    77.35ms   50.08ms   1.29s    95.97%
    Req/Sec   264.36    159.73   683.00     59.06%
  186472 requests in 1.00m, 30.05MB read
  Socket errors: connect 157, read 382, write 0, timeout 0
Requests/sec:   3102.66
Transfer/sec:    511.92KB
```

NodeJS http-proxy reverse proxy for hello-service:
```
wrk -t12 -c400 -d1m http://localhost:9080/gg
Running 1m test @ http://localhost:9080/gg
  12 threads and 400 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   231.00ms  179.79ms   1.43s    80.68%
    Req/Sec    66.65     54.04   393.00     75.58%
  25820 requests in 1.00m, 3.47MB read
  Socket errors: connect 195, read 1906, write 3, timeout 0
Requests/sec:    429.65
Transfer/sec:     59.16KB
```