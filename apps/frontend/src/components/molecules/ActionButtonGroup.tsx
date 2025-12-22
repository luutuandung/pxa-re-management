import type React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ActionButtonGroupProps {
  onApply: () => void;
  onExecute: () => void;
  onCancel: () => void;
}

const ActionButtonGroup: React.FC<ActionButtonGroupProps> = ({ onApply, onExecute, onCancel }) => {
  const { t } = useTranslation('costAggregationScenario');
  const [openApply, setOpenApply] = useState(false);
  const [openExecute, setOpenExecute] = useState(false);

  return (
    <div className="flex justify-center space-x-4">
      <Dialog open={openApply} onOpenChange={setOpenApply}>
        <DialogTrigger asChild>
          <Button
            onClick={() => setOpenApply(true)}
            size="lg"
            className="rounded-full bg-[#34B2D0] hover:bg-white border border-[#34B2D0] color-white hover:color-[#34B2D0] text-lg text-white hover:text-[#34B2D0]"
          >
            {t('buttons.apply')}
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>{t('modals.apply.title')}</DialogTitle>
          </DialogHeader>
          <p className="py-4">{t('modals.apply.message')}</p>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpenApply(false)}>
              {t('modals.apply.cancel')}
            </Button>
            <Button
              onClick={() => {
                onApply();
                setOpenApply(false);
              }}
            >
              {t('modals.apply.confirm')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openExecute} onOpenChange={setOpenExecute}>
        <DialogTrigger asChild>
          <Button
            onClick={() => setOpenExecute(true)}
            size="lg"
            className="rounded-full bg-[#34B2D0] hover:bg-white border border-[#34B2D0] color-white hover:color-[#34B2D0] text-lg text-white hover:text-[#34B2D0]"
          >
            {t('buttons.execute')}
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>{t('modals.execute.title')}</DialogTitle>
          </DialogHeader>
          <p className="py-4">{t('modals.execute.message')}</p>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpenExecute(false)}>
              {t('modals.execute.cancel')}
            </Button>
            <Button
              onClick={() => {
                onExecute();
                setOpenExecute(false);
              }}
            >
              {t('modals.execute.confirm')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Button
        onClick={onCancel}
        variant="outline"
        size="lg"
        className="rounded-full text-lg text-[#34B2D0] hover:bg-[#34B2D0] hover:text-white"
      >
        {t('buttons.cancel')}
      </Button>
    </div>
  );
};

export default ActionButtonGroup;
