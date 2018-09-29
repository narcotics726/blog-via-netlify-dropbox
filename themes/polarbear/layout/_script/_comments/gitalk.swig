{% if not (theme.duoshuo and theme.duoshuo.shortname) and not theme.duoshuo_shortname %}
  {% if theme.gitalk.enable %}
    {% if page.comments %}
      <script src="https://cdn.bootcss.com/blueimp-md5/2.10.0/js/md5.min.js"></script>
      <script src="https://unpkg.com/gitalk/dist/gitalk.min.js"></script>
      <script>
        //去除尾部匹配正则数组的字符串
        String.prototype.trimEnd = function(regStr)
        {
            var result = this;
            if(regStr==undefined||regStr==null||regStr=="")
            {
                return result;
            }
            var array = regStr.split(',');

            if(array.length > 0){

                var c = array.shift();
                var str= this;
                var i = str.length;
                var rg = new RegExp(c);
                var matchArr = str.match(rg);

                if(matchArr != undefined && matchArr != null && matchArr.length > 0)
                {
                  var matchStr = matchArr[0].replace(/\\/g, "\\\\").replace(/\*/g, "\\*")
                                            .replace(/\+/g, "\\+").replace(/\|/g, "\\|")
                                            .replace(/\{/g, "\\{").replace(/\}/g, "\\}")
                                            .replace(/\(/g, "\\(").replace(/\)/g, "\\)")
                                            .replace(/\^/g, "\\^").replace(/\$/g, "\\$")
                                            .replace(/\[/g, "\\[").replace(/\]/g, "\\]")
                                            .replace(/\?/g, "\\?").replace(/\,/g, "\\,")
                                            .replace(/\./g, "\\.").replace(/\&/g, "\\&");
                  matchStr = matchStr + '$';
                  result = str.replace(new RegExp(matchStr), "");
                }

                if(array.length > 0){
                    return result.trimEnd(array.join())
                }
                else{
                    return result;
                }
            }
        };
      </script>
      <script type="text/javascript">
        const gitalk = new Gitalk({
          clientID: '{{theme.gitalk.clientID}}',
          clientSecret: '{{theme.gitalk.clientSecret}}',
          repo: '{{theme.gitalk.repo}}',
          owner: '{{theme.gitalk.owner}}',
          admin: '{{theme.gitalk.admin}}'.split(','),
          pagerDirection: '{{theme.gitalk.pagerDirection}}',
          // facebook-like distraction free mode
          distractionFreeMode: false,
          id: md5(location.href.trimEnd('{{theme.gitalk.hreftrimend}}'))
        })
        gitalk.render('gitalk-container')
      </script>
    {% endif %}
  {% endif %}
{% endif %}