```
$ ruby -e 'loop { `gpio -g write 24 #{`gpio -g read 25`}`; sleep 0.1 }'
```

![img](./raspi-switch-ltica.gif)
