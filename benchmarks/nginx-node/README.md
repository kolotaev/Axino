# Test NGINX vs NodeJS http-proxy performance

Bare hello-service:
```
wrk -t12 -c400 -d1m http://localhost:8080/random
Running 1m test @ http://localhost:8080/random
  12 threads and 400 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    29.99ms   59.51ms   1.03s    98.60%
    Req/Sec     0.94k   491.76     2.81k    67.27%
  552915 requests in 1.00m, 88.05MB read
  Socket errors: connect 157, read 343, write 0, timeout 0
Requests/sec:   9200.67
Transfer/sec:      1.47MB
```

NGINX reverse proxy for hello-service:
```
wrk -t12 -c400 -d1m http://localhost:7080/random
Running 1m test @ http://localhost:7080/random
  12 threads and 400 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    95.64ms   96.33ms   1.25s    97.23%
    Req/Sec   235.04    164.81   848.00     51.16%
  163189 requests in 1.00m, 33.29MB read
  Socket errors: connect 157, read 362, write 5, timeout 0
Requests/sec:   2715.50
Transfer/sec:    567.32KB
```

NodeJS http-proxy reverse proxy for hello-service:
```
wrk -t12 -c400 -d1m http://localhost:9080/random
Running 1m test @ http://localhost:9080/random
  12 threads and 400 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   256.99ms  151.08ms   1.02s    63.71%
    Req/Sec    62.30     41.61   240.00     64.72%
  21817 requests in 1.00m, 3.87MB read
  Socket errors: connect 381, read 511, write 1, timeout 0
Requests/sec:    363.03
Transfer/sec:     65.93KB
```