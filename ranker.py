# This Python 3 environment comes with many helpful analytics libraries installed
# It is defined by the kaggle/python Docker image: https://github.com/kaggle/docker-python
# For example, here's several helpful packages to load

import numpy as np # linear algebra
import pandas as pd # data processing, CSV file I/O (e.g. pd.read_csv)

# Input data files are available in the read-only "../input/" directory
# For example, running this (by clicking run or pressing Shift+Enter) will list all files under the input directory

import os
for dirname, _, filenames in os.walk('/kaggle/input'):
    for filename in filenames:
        print(os.path.join(dirname, filename))

# You can write up to 5GB to the current directory (/kaggle/working/) that gets preserved as output when you create a version using "Save & Run All" 
# You can also write temporary files to /kaggle/temp/, but they won't be saved outside of the current session

import pandas as pd
#df = pd.read_csv("../input/master/master.csv")
df = pd.read_csv("masteroutput.csv")
#print(f'Number of rows    = {len(df)}')
#print(f'Number of columns = {len(df.columns)}')
df.head()

df['holistic'] = df.Founding_Year*0.1 + df.Article_Mentions*0.1 + df.Portfolio*0.1 + df.Investments*0.1 + df.Lead_Investments*0.1 + df.Exits*0.1 + df.TVPI*0.1 + df.IRR*0.1 + df.DPI*0.1 + df.RVPI*0.1 + df.Gain_Since_Inception*0.1 + df.Funding_Rounds*-0.1 + df.Total_Funding*0.1
df.sort_values(by='holistic', ascending=False, kind='quicksort', na_position='last')
df.head()


=D2*0.1+J2*0.1 + G2*0.1 + H2*0.1 + I2*0.1 + K2*0.1 + N2*0.1 + M2*0.1 + O2*0.1 + P2*0.1 + U2*0.1 + Z2*-0.1 + AD*0.1

x = sample(-0.1:100000000, 50000000)
= (x-min(x))/(max(x)-min(x))

=ARRAYFORMULA(D2:D*0.05+J2:J*0.05 + G2:G*0.1 + H2:H*0.1 + I2:I*0.1 + K2:K*0.1 + N2:N*0.1 + M2:M*0.1 + O2:O*0.05 + P2:P*0.05 + U2:U*0.05 + Z2:Z*-0.05 + AD2:AD*0.1)
=(AG2:AG-min(AG:AG))/(max(AG:AG)-min(AG:AG))
=ArrayFormula(AH2:AH*100)

=C3:C*$C$1+ F3:F*$F$1 + G3:G*$G$1 + H3:H*$H$1 + I3:I*$I$1 + J3:J*$J$1 + K3:K*$K$1 + L3:L*$L$1 + M3:M*$M$1 + N3:N*$N$1 + O3:O*$O$1 + P3:P*$P$1 + Q3:Q*$Q$1 + R3:R*$R$1 + S3:S*$S$1 + W3:W*$W$1 + X3:X*$X$1 + AB3:AB*$AB$1

=$C$1+ $F$1 + $G$1 + $H$1 + $I$1 + $J$1 + $K$1 + $L$1 + $M$1 + $N$1 + $O$1 + $P$1 + $Q$1 + $R$1 + $S$1 + $W$1 + $X$1 + $AB$1